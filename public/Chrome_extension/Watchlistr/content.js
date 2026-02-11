// TMDB Genre Map
const GENRES = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Content script received message:", request);
  if (request.action === "showResults") {
    console.log("showResults action received with results:", request.results);
    console.log("Raw results:", request.rawResults);
    // Fetch current watchlist FIRST to check for duplicates
    chrome.storage.local.get({ watchlist: [] }, (result) => {
      console.log("Current watchlist:", result.watchlist);
      createOverlay(request.rawResults || request.results, result.watchlist);
    });
  }
});

// Helper for content script (similar to popup but specialized class)
function getContentPosterHtml(path) {
  const svgIcon = `<svg viewBox="0 0 24 24"><path d="M19.8 4H4.2C3 4 2 5 2 6.2v11.6C2 19 3 20 4.2 20h15.6c1.2 0 2.2-1 2.2-2.2V6.2C22 5 21 4 19.8 4zM20 18H4V6h16v12z"/></svg>`;
  
  if (path) {
    // Try image, fallback to div on error
    return `<img src="https://image.tmdb.org/t/p/w92${path}" class="watchlistr-poster-thumb" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div class="watchlistr-poster-placeholder" style="display:none">${svgIcon}</div>`;
  } else {
    return `<div class="watchlistr-poster-placeholder">${svgIcon}</div>`;
  }
}

function createOverlay(items, currentWatchlist) {
  console.log("createOverlay called with items:", items);
  const existing = document.getElementById("watchlistr-overlay");
  if (existing) existing.remove();

  const container = document.createElement("div");
  container.id = "watchlistr-overlay";
  console.log("Overlay container created and added to DOM");

  container.innerHTML = `
    <div id="watchlistr-header">
      <h3>Select Title</h3>
      <button id="watchlistr-close" class="watchlistr-close-icon">&times;</button>
    </div>
    <div class="watchlistr-content" id="watchlistr-list"></div>
  `;

  document.body.appendChild(container);
  document.getElementById("watchlistr-close").onclick = () => container.remove();
  
  const listContainer = document.getElementById("watchlistr-list");
  const existingIds = new Set(currentWatchlist.map(m => m.id));

  if (!items || items.length === 0) {
    console.log("No items to display");
    listContainer.innerHTML = '<p style="color:#b3b3b3; padding:15px; text-align:center; font-size:13px;">No results found.</p>';
  } else {
    console.log("Processing", items.length, "items");
    items.forEach((item, index) => {
      console.log("Processing item", index, ":", item);
      const element = document.createElement("div");
      element.className = "watchlistr-item";
      
      // Handle both movie and TV show data
      const isMovie = item.title !== undefined;
      const title = item.title || item.name;
      const year = isMovie 
        ? (item.release_date ? item.release_date.split('-')[0] : 'N/A')
        : (item.first_air_date ? item.first_air_date.split('-')[0] : 'N/A');
      
      const posterHtml = getContentPosterHtml(item.poster_path);
      
      const genreList = item.genre_ids 
        ? item.genre_ids.map(id => GENRES[id]).filter(Boolean).slice(0, 2).join(", ") 
        : "";

      let overview = item.overview || "";
      if (overview.length > 60) overview = overview.substring(0, 60) + "...";

      const isAlreadyAdded = existingIds.has(item.id);

      element.innerHTML = `
        ${posterHtml}
        <div class="watchlistr-info">
          <div class="watchlistr-title">${title}</div>
          <div class="watchlistr-meta">
            <span>${year}</span>
            ${genreList ? `<span class="watchlistr-dot">&bull;</span> <span>${genreList}</span>` : ''}
          </div>
          <div class="watchlistr-overview">${overview}</div>
        </div>
        <div class="watchlistr-action">
            <button class="watchlistr-add-btn" ${isAlreadyAdded ? 'disabled' : ''}>
                ${isAlreadyAdded ? 'IN LIST' : 'ADD'}
            </button>
        </div>
      `;
      
      const btn = element.querySelector('.watchlistr-add-btn');
      if (!isAlreadyAdded) {
        btn.onclick = () => addToStorage(item);
      } else {
        btn.style.borderColor = "#333";
        btn.style.color = "#555";
        btn.style.cursor = "default";
      }

      listContainer.appendChild(element);
      console.log("Item", index, "added to overlay");
    });
  }
  console.log("createOverlay finished");
}

function addToStorage(item) {
  chrome.storage.local.get({ watchlist: [] }, (result) => {
    const watchlist = result.watchlist;
    
    // Double Check
    if (!watchlist.some(m => m.id === item.id)) {
      const isMovie = item.title !== undefined;
      const title = item.title || item.name;
      const year = isMovie 
        ? (item.release_date ? item.release_date.split('-')[0] : 'N/A')
        : (item.first_air_date ? item.first_air_date.split('-')[0] : 'N/A');
      
      const genreNames = item.genre_ids 
        ? item.genre_ids.map(id => GENRES[id]).filter(Boolean).slice(0, 2).join(", ")
        : "Unknown";

      watchlist.push({
        id: item.id,
        title: title,
        year: year,
        poster: item.poster_path,
        genres: genreNames,
        overview: item.overview,
        timestamp: Date.now()
      });
      
      chrome.storage.local.set({ watchlist: watchlist }, () => {
        const btn = document.activeElement;
        if(btn && btn.classList.contains('watchlistr-add-btn')) {
            btn.innerText = "✓";
            btn.style.background = "#46d369";
            btn.style.borderColor = "#46d369";
            btn.style.color = "#000";
        }
        setTimeout(() => document.getElementById("watchlistr-overlay").remove(), 800);
      });
    }
  });
}