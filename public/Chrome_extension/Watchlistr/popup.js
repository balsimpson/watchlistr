const GENRES = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

let activeList = [];
let watchedList = [];
let currentView = 'active'; // 'active' or 'watched'
let debounceTimer;

document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear'); // NEW

  // View Toggles
  document.getElementById('view-active').addEventListener('click', () => switchView('active'));
  document.getElementById('view-watched').addEventListener('click', () => switchView('watched'));
  
  // Existing Controls
  document.getElementById('filter-genre').addEventListener('change', renderLocalView);
  document.getElementById('sort-order').addEventListener('change', renderLocalView);
  document.getElementById('back-btn').addEventListener('click', switchToLocal);

  // NEW: Clear Button Logic
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.style.display = 'none';
    searchInput.focus();
    clearTimeout(debounceTimer); // Stop any pending online searches
    switchToLocal(); // Reset to full list view
  });

  // Search Logic
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    
    // Toggle Clear Button visibility
    searchClear.style.display = query.length > 0 ? 'block' : 'none';

    clearTimeout(debounceTimer);

    if (query.length === 0) {
      if (document.getElementById('back-btn').style.display !== 'none') {
        switchToLocal();
      } else {
        renderLocalView();
      }
      return;
    }

    const localMatches = getLocalMatches(query);

    if (localMatches.length > 0) {
      renderLocalView(); 
    } else {
      if (currentView === 'active') {
         renderLocalView(); 
         debounceTimer = setTimeout(() => triggerOnlineSearch(query), 600);
      } else {
         renderLocalView(); 
      }
    }
  });

  loadLists();
}

function loadLists() {
  chrome.storage.local.get({ watchlist: [], watchedlist: [] }, (result) => {
    activeList = result.watchlist;
    watchedList = result.watchedlist;
    populateGenreFilter();
    updateHeaderCount();
    renderLocalView();
  });
}

function switchView(view) {
  currentView = view;
  
  // Toggle UI styling
  document.getElementById('view-active').classList.toggle('active', view === 'active');
  document.getElementById('view-watched').classList.toggle('active', view === 'watched');
  
  // Reset Search
  document.getElementById('search-input').value = '';
  document.getElementById('back-btn').style.display = 'none';
  document.getElementById('app-title').innerText = "WATCHLISTR";
  document.getElementById('filters-row').style.display = 'flex';
  
  updateHeaderCount();
  renderLocalView();
}

function updateHeaderCount() {
  const count = currentView === 'active' ? activeList.length : watchedList.length;
  const label = currentView === 'active' ? 'Movies' : 'Seen';
  document.getElementById('list-count').innerText = `${count} ${label}`;
}

function getLocalMatches(query) {
  const sourceList = currentView === 'active' ? activeList : watchedList;
  const genreFilter = document.getElementById('filter-genre').value;
  
  return sourceList.filter(movie => {
    const matchesGenre = (genreFilter === 'all') || (movie.genres && movie.genres.includes(genreFilter));
    const matchesSearch = movie.title.toLowerCase().includes(query);
    return matchesGenre && matchesSearch;
  });
}

function switchToLocal() {
  document.getElementById('back-btn').style.display = 'none';
  document.getElementById('app-title').innerText = "WATCHLISTR";
  document.getElementById('filters-row').style.display = 'flex';
  
  // Ensure clear button is hidden if input is empty
  const searchInput = document.getElementById('search-input');
  if (searchInput.value === '') {
      document.getElementById('search-clear').style.display = 'none';
  }

  renderLocalView();
}

// function renderLocalView() {
//   const container = document.getElementById('movie-list');
//   const emptyState = document.getElementById('empty-state');
//   const searchQuery = document.getElementById('search-input').value.toLowerCase().trim();
//   const sortOrder = document.getElementById('sort-order').value;

//   let filtered = getLocalMatches(searchQuery);

//   // Sorting Logic
//   filtered.sort((a, b) => {
//     const timeA = a.timestamp || 0;
//     const timeB = b.timestamp || 0;
//     const yearA = parseInt(a.year) || 0;
//     const yearB = parseInt(b.year) || 0;

//     switch (sortOrder) {
//       case 'added_desc': return timeB - timeA;
//       case 'added_asc':  return timeA - timeB;
//       case 'year_desc':  return yearB - yearA;
//       case 'year_asc':   return yearA - yearB;
//       default: return 0;
//     }
//   });

//   container.innerHTML = '';

//   if (filtered.length === 0) {
//     if (searchQuery.length > 0 && currentView === 'active') {
//         container.innerHTML = '<p style="text-align:center; color:#444; font-size:12px; margin-top:20px;">...</p>';
//     } else {
//         emptyState.querySelector('p').innerText = currentView === 'active' ? "Your list is empty." : "No history yet.";
//         emptyState.style.display = 'block';
//     }
//   } else {
//     emptyState.style.display = 'none';
//     filtered.forEach(movie => createCard(movie, container, currentView === 'active' ? 'manage' : 'history'));
//   }
// }

function triggerOnlineSearch(query) {
  // 1. Setup UI
  document.getElementById('back-btn').style.display = 'block';
  document.getElementById('app-title').innerText = "ADD MOVIE";
  document.getElementById('filters-row').style.display = 'none';
  document.getElementById('empty-state').style.display = 'none';
  // Hide the manual search button while searching
  const onlineBtn = document.getElementById('online-search-btn'); 
  if(onlineBtn) onlineBtn.style.display = 'none';
  
  const container = document.getElementById('movie-list');
  
  // 2. Show Spinner
  container.innerHTML = `
    <div class="loader-container">
        <div class="spinner"></div>
        <span>Searching TMDB...</span>
    </div>`;

  // 3. Send Message
  chrome.runtime.sendMessage({ action: "search_tmdb", query: query }, (response) => {
    
    // Check for Chrome Runtime Errors (e.g., background script crashed)
    if (chrome.runtime.lastError) {
      console.error("Runtime Error:", chrome.runtime.lastError);
      container.innerHTML = `<p style="text-align:center; color:#e50914; padding:20px; font-size:12px;">Extension Error: Please reload the extension.</p>`;
      return;
    }

    // Check for API Errors
    if (response && response.success) {
      renderOnlineResults(response.data.results);
    } else {
      const errorMsg = response ? response.error : "Unknown Error";
      console.error("Search Error:", errorMsg);
      container.innerHTML = `<p style="text-align:center; color:#e50914; padding:20px; font-size:12px;">${errorMsg}</p>`;
    }
  });
}

function renderLocalView() {
  const container = document.getElementById('movie-list');
  const emptyState = document.getElementById('empty-state');
  const onlineBtn = document.getElementById('online-search-btn'); // Get the button
  const searchTermSpan = document.getElementById('search-term-span');
  
  const searchQuery = document.getElementById('search-input').value.toLowerCase().trim();
  const sortOrder = document.getElementById('sort-order').value;

  let filtered = getLocalMatches(searchQuery);

  // Sorting Logic
  filtered.sort((a, b) => {
    const timeA = a.timestamp || 0;
    const timeB = b.timestamp || 0;
    const yearA = parseInt(a.year) || 0;
    const yearB = parseInt(b.year) || 0;

    switch (sortOrder) {
      case 'added_desc': return timeB - timeA;
      case 'added_asc':  return timeA - timeB;
      case 'year_desc':  return yearB - yearA;
      case 'year_asc':   return yearA - yearB;
      default: return 0;
    }
  });

  container.innerHTML = '';

  // 1. Handle Empty State vs Results
  if (filtered.length === 0) {
    if (searchQuery.length > 0 && currentView === 'active') {
        // Auto-search is handling this via debounce, but we can show a spacer/loader placeholder here if needed
        // For now, let's keep it clean or show a subtle message
    } else {
        emptyState.querySelector('p').innerText = currentView === 'active' ? "Your list is empty." : "No history yet.";
        emptyState.style.display = 'block';
    }
  } else {
    emptyState.style.display = 'none';
    filtered.forEach(movie => createCard(movie, container, currentView === 'active' ? 'manage' : 'history'));
  }

  // 2. LOGIC: Show "Search TMDB" button?
  // Show it if: 
  // - We are in "Active" view (not history)
  // - There is text in the search bar
  // - We actually have local results (because if we have 0 local results, the auto-search kicks in anyway)
  if (currentView === 'active' && searchQuery.length > 0 && filtered.length > 0) {
    onlineBtn.style.display = 'block';
    searchTermSpan.innerText = document.getElementById('search-input').value;
    
    // Attach click event to force the online search
    onlineBtn.onclick = () => triggerOnlineSearch(searchQuery);
  } else {
    onlineBtn.style.display = 'none';
  }
}

function renderOnlineResults(movies) {
  const container = document.getElementById('movie-list');
  container.innerHTML = '';
  
  if (!movies || movies.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:#888; padding:20px;">No results found.</p>';
    return;
  }

  // Check both lists to prevent duplicates
  const allIds = new Set([...activeList, ...watchedList].map(m => m.id));

  movies.slice(0, 10).forEach(movie => {
    const genreNames = movie.genre_ids 
      ? movie.genre_ids.map(id => GENRES[id]).filter(Boolean).slice(0, 2).join(", ") 
      : "Unknown";
      
    const movieObj = {
      id: movie.id,
      title: movie.title,
      year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
      poster: movie.poster_path,
      genres: genreNames,
      overview: movie.overview
    };
    
    // Pass 'add' mode, and check if duplicate
    createCard(movieObj, container, 'add', allIds.has(movie.id));
  });
}

function createCard(movie, container, mode, isDuplicate = false) {
  const card = document.createElement('div');
  card.className = 'movie-card';

  // Open IMDb on click
  card.onclick = () => {
    const query = encodeURIComponent(`${movie.title} ${movie.year}`);
    window.open(`https://www.imdb.com/find?q=${query}&s=tt`, '_blank');
  };

  const posterHtml = getPosterHtml(movie.poster, 'poster-img');
  const genreDisplay = movie.genres ? movie.genres : "Gen N/A";
  let overviewText = movie.overview || "No description available.";

  // Icons (SVG Paths)
  const iconPlus = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`;
  const iconCheck = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
  const iconEye = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;
  const iconTrash = `<span style="font-size:18px; line-height:1;">&times;</span>`;

  let actionHtml = '';
  
  if (mode === 'add') {
     // Use Icons for Add/Duplicate state
     const content = isDuplicate ? iconCheck : iconPlus;
     const tooltip = isDuplicate ? "Already in List" : "Add to List";
     actionHtml = `<div class="card-actions"><button class="action-btn add-btn" title="${tooltip}" ${isDuplicate ? 'disabled' : ''}>${content}</button></div>`;
  } else if (mode === 'manage') {
     actionHtml = `
       <div class="card-actions">
         <button class="action-btn watch-btn" title="Mark as Watched">${iconEye}</button>
         <button class="action-btn delete-btn" title="Remove">${iconTrash}</button>
       </div>`;
  } else {
     // History View
     actionHtml = `
       <div class="card-actions">
         <button class="action-btn delete-btn" style="height:100%" title="Remove">${iconTrash}</button>
       </div>`;
  }

  card.innerHTML = `
    ${posterHtml}
    <div class="card-details">
      <div class="card-title" title="${movie.title}">${movie.title}</div>
      <div class="card-meta">
         <span class="year-badge">${movie.year}</span>
         <span class="meta-divider">&bull;</span>
         <span class="card-genre">${genreDisplay}</span>
      </div>
      <div class="card-overview">${overviewText}</div>
    </div>
    ${actionHtml}
  `;

  // Attach Listeners
  if (mode === 'add') {
    const btn = card.querySelector('.add-btn');
    btn.onclick = (e) => { 
        e.stopPropagation(); 
        if (!isDuplicate) {
            // Update Icon immediately on click
            btn.innerHTML = iconCheck; 
            addMovieFromSearch(movie, btn); 
        }
    };
  } else {
    // Delete Button
    const delBtn = card.querySelector('.delete-btn');
    if (delBtn) delBtn.onclick = (e) => { 
        e.stopPropagation(); 
        removeMovie(movie.id); 
    };

    // Watch Button
    const watchBtn = card.querySelector('.watch-btn');
    if (watchBtn) watchBtn.onclick = (e) => { 
        e.stopPropagation(); 
        markAsWatched(movie); 
    };
  }

  container.appendChild(card);
}

function markAsWatched(movie) {
  // 1. Remove from Active
  activeList = activeList.filter(m => m.id !== movie.id);
  
  // 2. Add to Watched (Update timestamp to now)
  const watchedMovie = { ...movie, timestamp: Date.now(), watched: true };
  watchedList.push(watchedMovie);

  // 3. Save Both
  chrome.storage.local.set({ watchlist: activeList, watchedlist: watchedList }, () => {
    updateHeaderCount();
    renderLocalView(); // Will disappear from current view
  });
}

function removeMovie(id) {
  if (currentView === 'active') {
    activeList = activeList.filter(m => m.id !== id);
    chrome.storage.local.set({ watchlist: activeList }, () => {
      updateHeaderCount();
      renderLocalView();
    });
  } else {
    watchedList = watchedList.filter(m => m.id !== id);
    chrome.storage.local.set({ watchedlist: watchedList }, () => {
      updateHeaderCount();
      renderLocalView();
    });
  }
}

function addMovieFromSearch(movie, btnElement) {
  movie.timestamp = Date.now();
  activeList.push(movie);
  
  chrome.storage.local.set({ watchlist: activeList }, () => {
    // Visual Feedback: Green Checkmark
    btnElement.style.backgroundColor = "#2ecc71";
    btnElement.style.color = "#000";
    btnElement.disabled = true;
    
    setTimeout(() => {
      document.getElementById('search-input').value = '';
      const searchClear = document.getElementById('search-clear');
      if(searchClear) searchClear.style.display = 'none'; // Hide X button
      clearTimeout(debounceTimer);
      switchToLocal();
    }, 800);
  });
}

function getPosterHtml(path, className) {
  const svgIcon = `<svg viewBox="0 0 24 24"><path d="M19.8 4H4.2C3 4 2 5 2 6.2v11.6C2 19 3 20 4.2 20h15.6c1.2 0 2.2-1 2.2-2.2V6.2C22 5 21 4 19.8 4zM20 18H4V6h16v12z"/></svg>`;
  if (path) {
    return `<img src="https://image.tmdb.org/t/p/w154${path}" class="${className}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div class="${className === 'poster-img' ? 'poster-placeholder' : 'watchlistr-poster-placeholder'}" style="display:none">${svgIcon}</div>`;
  } else {
    return `<div class="${className === 'poster-img' ? 'poster-placeholder' : 'watchlistr-poster-placeholder'}">${svgIcon}</div>`;
  }
}

function populateGenreFilter() {
  const genreSelect = document.getElementById('filter-genre');
  const uniqueGenres = new Set();
  [...activeList, ...watchedList].forEach(movie => {
    if (movie.genres) movie.genres.split(', ').forEach(g => uniqueGenres.add(g));
  });
  const sortedGenres = Array.from(uniqueGenres).sort();
  genreSelect.innerHTML = '<option value="all">All Genres</option>';
  sortedGenres.forEach(genre => {
    const opt = document.createElement('option');
    opt.value = genre;
    opt.innerText = genre;
    genreSelect.appendChild(opt);
  });
}