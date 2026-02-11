const TMDB_API_KEY = 'bcde1195dc8ce8278f7fd88e160d3d72';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "add-watchlist",
    title: "Add to Watchlist",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  const query = info.selectionText?.trim();
  console.log("Context menu clicked with query:", query);
  if (!query) return;

  const [movieRes, tvRes] = await Promise.all([
    searchTMDB("movie", query),
    searchTMDB("tv", query)
  ]);

  console.log("Movie results:", movieRes);
  console.log("TV results:", tvRes);
  const movie = movieRes.results?.[0];
  const tv = tvRes.results?.[0];
  console.log("First movie:", movie);
  console.log("First TV:", tv);

  if (!movie && !tv) return;

  const picked = pickBest(movie, tv);
  const key = `${picked.type}_${picked.id}`;

  chrome.storage.local.get(key, exists => {
    if (exists[key]) return;

    chrome.storage.local.set({
      [key]: picked
    });

    // Send results to content script to display overlay
    const mappedMovie = movie ? mapMovie(movie) : null;
    const mappedTV = tv ? mapTV(tv) : null;
    const resultsToSend = [mappedMovie, mappedTV].filter(Boolean);
    console.log("Sending showResults message with:", resultsToSend);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        console.log("Sending to tab:", tabs[0].id);
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "showResults",
          results: resultsToSend,
          rawResults: [movie, tv].filter(Boolean),
          picked: picked
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Message send error:", chrome.runtime.lastError);
          } else {
            console.log("Message sent successfully");
          }
        });
      } else {
        console.error("No active tab found");
      }
    });
  });
});

async function searchTMDB(type, query) {
  const url = `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
  console.log("Searching TMDB with URL:", url);
  console.log("API Key:", TMDB_API_KEY);
  const res = await fetch(
    url,
    {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );
  console.log("TMDB Response status:", res.status);
  const data = await res.json();
  console.log("TMDB Response:", data);
  return data;
}

function pickBest(movie, tv) {
  if (!movie) return mapTV(tv);
  if (!tv) return mapMovie(movie);

  return movie.popularity > tv.popularity
    ? mapMovie(movie)
    : mapTV(tv);
}

function mapMovie(m) {
  return {
    id: m.id,
    type: "movie",
    title: m.title,
    year: m.release_date?.slice(0, 4) || "—",
    poster: m.poster_path
      ? `https://image.tmdb.org/t/p/w200${m.poster_path}`
      : ""
  };
}

function mapTV(t) {
  return {
    id: t.id,
    type: "tv",
    title: t.name,
    year: t.first_air_date?.slice(0, 4) || "—",
    poster: t.poster_path
      ? `https://image.tmdb.org/t/p/w200${t.poster_path}`
      : ""
  };
}