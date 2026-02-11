const TMDB_API_KEY = 'bcde1195dc8ce8278f7fd88e160d3d72';
// ---------------------

// 1. Context Menu: "Add to Watchlistr"
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "add-to-watchlistr",
    title: "Add '%s' to Watchlistr",
    contexts: ["selection"]
  }, () => {
    if (chrome.runtime.lastError) console.log("Menu item already exists.");
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "add-to-watchlistr") {
    fetchMovieData(info.selectionText).then(data => {
      chrome.tabs.sendMessage(tab.id, {
        action: "show_movie_options",
        movies: data.results ? data.results.slice(0, 3) : [] 
      });
    }).catch(err => console.error("Context Menu Error:", err));
  }
});

// 2. Message Listener: Handles Popup Search
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "search_tmdb") {
    
    // Call the async function
    fetchMovieData(request.query)
      .then(data => {
        // Send success back to popup
        sendResponse({ success: true, data: data });
      })
      .catch(error => {
        // Send error back to popup
        sendResponse({ success: false, error: error.toString() });
      });

    // IMPORTANT: Return true to keep the message channel open for async response
    return true; 
  }
});

// 3. Helper Function to fetch from TMDB
async function fetchMovieData(query) {
  if (!TMDB_API_KEY || TMDB_API_KEY === 'YOUR_TMDB_API_KEY') {
    throw new Error("Missing TMDB API Key in background.js");
  }

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}