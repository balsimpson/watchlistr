/* eslint-disable */
const API_KEY = "api_key=bcde1195dc8ce8278f7fd88e160d3d72";
const BASE_URL = "https://api.themoviedb.org/3";

const languages = {
	en: "English",
	fr: "French",
	de: "German",
	it: "Italian",
	es: "Spanish",
	ja: "Japanese",
	pt: "Portuguese",
	ru: "Russian",
	zh: "Chinese",
	ko: "Korean",
	pl: "Polish",
	tr: "Turkish",
	he: "Hebrew",
	ar: "Arabic",
	hi: "Hindi",
	id: "Indonesian",
	fa: "Persian",
	th: "Thai",
	vi: "Vietnamese",
	ms: "Malay",
	sv: "Swedish",
	no: "Norwegian",
	da: "Danish",
	is: "Icelandic",
	fi: "Finnish",
	nl: "Dutch",
	cs: "Czech",
	el: "Greek",
	hu: "Hungarian",
	hr: "Croatian",
	mk: "Macedonian",
	cn: "Chinese",
};

const genres = {
	28: "Action",
	12: "Adventure",
	10759: "Action & Adventure",
	16: "Animation",
	35: "Comedy",
	80: "Crime",
	99: "Documentary",
	18: "Drama",
	10751: "Family",
	14: "Fantasy",
	36: "History",
	27: "Horror",
	10762: "Kids",
	10402: "Music",
	9648: "Mystery",
	10763: "News",
	10764: "Reality",
	10749: "Romance",
	878: "Science Fiction",
	10765: "Sci-Fi & Fantasy",
	10766: "Soap",
	10767: "Talk",
	10770: "TV Movie",
	53: "Thriller",
	10752: "War",
	10768: "War & Politics",
	37: "Western",
};

const search = async (query, type) => {
	try {
		let url = `${BASE_URL}/search/${type}?${API_KEY}&query=${query}`;
		return await doFetch(url);
	} catch (error) {
		console.log(error);
		return error;
	}
};

const getEpisodes = async (showId, seasonNo = 1) => {
	try {
		let url = `${BASE_URL}/tv/${showId}/season/${seasonNo}?${API_KEY}`;
		return await doFetch(url);
	} catch (error) {
		console.log(error.message);
		return error;
	}
};

const getShowDetails = async (showId) => {
	try {
		let url = `${BASE_URL}/tv/${showId}?${API_KEY}`;
		return await doFetch(url);
	} catch (error) {
		console.log(error.message);
		return error;
	}
};

export const getSimilarMovies = async (id) => {
	let url = `${BASE_URL}/movie/${id}/similar?${API_KEY}`;
	let res = await doFetch(url);
	console.log(res);
};

const getWatchProvider = async (type, id) => {
	try {
		let providers = [];
		let url = `${BASE_URL}/${type}/${id}/watch/providers?${API_KEY}`;
		let res = await doFetch(url);

		if (res && res.results) {
			providers = res.results;
		}

		return providers;
	} catch (error) {
		console.log(error.message);
		return error;
	}
};

const getYear = (date) => {
	if (!date) return;
	let year = date.split("-")[0];
	return year;
};

const getLanguage = (lang) => {
	if (!lang) return;
	let language = languages[lang];
	return language;
};

const getSpokenLanguage = (langsArray) => {
	if (!langsArray) return;

	let languages = [];

	langsArray.map((lang) => {
		languages.push(lang.english_name);
	});

	return languages;
};

const getGenre = (genreIds) => {
	const genres = {
		28: "Action",
		12: "Adventure",
		10759: "Action & Adventure",
		16: "Animation",
		35: "Comedy",
		80: "Crime",
		99: "Documentary",
		18: "Drama",
		10751: "Family",
		14: "Fantasy",
		36: "History",
		27: "Horror",
		10762: "Kids",
		10402: "Music",
		9648: "Mystery",
		10763: "News",
		10764: "Reality",
		10749: "Romance",
		878: "Science Fiction",
		10765: "Sci-Fi & Fantasy",
		10766: "Soap",
		10767: "Talk",
		10770: "TV Movie",
		53: "Thriller",
		10752: "War",
		10768: "War & Politics",
		37: "Western",
	};
	const genretxt = [];
	if (genreIds && genreIds.length) {
		genreIds.forEach((genre) => {
			// genretxt.push(genres[genre]);
			genretxt.push({
				value: genre,
				text: genres[genre],
			});
		});
	} else {
		// genretxt.push(genres[genre]);
		genretxt.push({
			value: genreIds,
			text: genres[genreIds],
		});
	}
	return genretxt;
};

const getGenreText = (genreIds) => {
	// console.log("ids", genreIds);
	const genres = {
		28: "Action",
		12: "Adventure",
		10759: "Action & Adventure",
		16: "Animation",
		35: "Comedy",
		80: "Crime",
		99: "Documentary",
		18: "Drama",
		10751: "Family",
		14: "Fantasy",
		36: "History",
		27: "Horror",
		10762: "Kids",
		10402: "Music",
		9648: "Mystery",
		10763: "News",
		10764: "Reality",
		10749: "Romance",
		878: "Science Fiction",
		10765: "Sci-Fi & Fantasy",
		10766: "Soap",
		10767: "Talk",
		10770: "TV Movie",
		53: "Thriller",
		10752: "War",
		10768: "War & Politics",
		37: "Western",
	};
	const genretxt = [];
	if (genreIds && genreIds.length) {
		genreIds.forEach((genre) => {
			// console.log(genre.id);
			genretxt.push(genre.name);
		});
	}
	return genretxt;
};

const searchGenre = (genre) => {
	const genres = {
		action: "Action__28",
		adventure: "Adventure__12",
		"action-adventure": "Action & Adventure__10759",
		animation: "Animation__16",
		comedy: "Comedy__35",
		crime: "Crime__80",
		documentary: "Documentary__99",
		drama: "Drama__18",
		family: "Family__10751",
		fantasy: "Fantasy__14",
		history: "History__36",
		horror: "Horror__27",
		kids: "Kids__10762",
		music: "Music__10402",
		mystery: "Mystery__9648",
		news: "News__10763",
		reality: "Reality__10764",
		romance: "Romance__10749",
		"science-fiction": "Science Fiction__878",
		"scifi-fantasy": "Sci-Fi & Fantasy__10765",
		soap: "Soap__10766",
		talk: "Talk__10767",
		tv_movie: "TV Movie__10770",
		thriller: "Thriller__53",
		war: "War__10752",
		war_politics: "War & Politics__10768",
		western: "Western__37",
	};
	return genres[genre];
};

/**
 * @param  {string} path - The path to the file
 * @param  {string} size - The size of the file ('w92'|'w154'|'w185'|'w342'|'w500'|'w780'|'original')
 * @example getImageURL('/path/to/file.jpg', 'w500'));
 */

const getImageURL = (path, size = "large") => {
	const poster_sizes = {
		tiny: "w92",
		small: "w154",
		medium: "w185",
		large: "w342",
		xl: "w500",
		huge: "w780",
		original: "original",
	};
	if (path) {
		return `https://image.tmdb.org/t/p/${poster_sizes[size]}${path}`;
	} else {
		// return "imgnotfound.png";
		return "";
	}
};

const getFormattedShowDetails = async (showId, seasonNo = 1) => {
	let showDetails = await doFetch(`${BASE_URL}/tv/${showId}?${API_KEY}`);
	let episodes = await doFetch(
		`${BASE_URL}/tv/${showId}/season/${seasonNo}?${API_KEY}`
	);
	let credits = await doFetch(`${BASE_URL}/tv/${showId}/credits?${API_KEY}`);

	let cast = credits.cast.slice(0, 3) || [];
	let castNames = [];
	let crew = credits.crew || [];
	// let crew = credits.crew.slice(0, 3) || [];
	let crewNames = [];

	if (cast.length) {
		cast.forEach((actor) => {
			castNames.push({
				name: actor.name,
				character: actor.character,
			});
		});
	}

	if (crew.length) {
		crew.forEach((actor) => {
			if (
				actor.job == "Director" ||
				actor.job == "Screenplay" ||
				actor.job == "Story" ||
				actor.job == "Director of Photography" ||
				actor.job == "Editor"
			) {
				crewNames.push({
					name: actor.name,
					job: actor.job,
				});
			}
		});
	}

	let seasons = [];
	let specials = "";

	for (const season of showDetails.seasons) {
		// console.log('seasons', season);
		if (season.name != "Specials") {
			seasons.push(season);
		} else {
			specials = season;
		}
	}

	if (specials) {
		seasons.push(specials);
	}

	// console.log('show details', showDetails);

	let show = {
		id: showDetails.id,
		title: showDetails.name,
		created_by: showDetails.created_by,
		backdrop_path: showDetails.backdrop_path,
		poster_path: showDetails.poster_path,
		overview: showDetails.overview,
		first_air_date: showDetails.first_air_date,
		number_of_episodes: showDetails.number_of_episodes,
		number_of_seasons: showDetails.number_of_seasons,
		episode_run_time: showDetails.episode_run_time || [],
		seasons: seasons,
		genres: showDetails.genres || [],
		language: showDetails.original_language,
		homepage: showDetails.homepage,
		// cast: castNames,
		// crew: crewNames,
		media_type: "tv",
	};

	show.seasons[seasonNo - 1].episodes = episodes.episodes;

	// console.log('show', show)
	return show;
};

const getFormattedMovieDetails = async (movieId) => {
	let movieDetails = await doFetch(`${BASE_URL}/movie/${movieId}?${API_KEY}`);
	let credits = await doFetch(
		`${BASE_URL}/movie/${movieId}/credits?${API_KEY}`
	);

	let cast = credits.cast.slice(0, 3) || [];
	let castNames = [];
	let crew = credits.crew || [];
	// let crew = credits.crew.slice(0, 3) || [];
	let crewNames = [];

	if (cast.length) {
		cast.forEach((actor) => {
			castNames.push({
				name: actor.name,
				character: actor.character,
			});
		});
	}

	if (crew.length) {
		crew.forEach((actor) => {
			if (
				actor.job == "Director" ||
				actor.job == "Screenplay" ||
				actor.job == "Story" ||
				actor.job == "Director of Photography" ||
				actor.job == "Editor" ||
				actor.job == "Music" ||
				actor.job == "Original Music Composer" ||
				actor.job == "Art Direction"
			) {
				crewNames.push({
					name: actor.name,
					job: actor.job,
				});
			}
		});
	}

	// console.log("movieDetails", movieDetails);
	// console.log('credits', credits);

	let movie = {
		id: movieDetails.id,
		imdb_id: movieDetails.imdb_id,
		title: movieDetails.title,
		poster_path: movieDetails.poster_path,
		backdrop_path: movieDetails.poster_path,
		overview: movieDetails.overview,
		genres: movieDetails.genres,
		runtime: movieDetails.runtime,
		tagline: movieDetails.tagline,
		spoken_languages: movieDetails.spoken_languages,
		release_date: movieDetails.release_date,
		cast: castNames,
		crew: crewNames,
		media_type: "movie",
	};
	return movie;
};

const getFormattedCrew = (crew) => {
	const crewByJob = crew.reduce((acc, { name, job }) => {
		if (!acc[job]) {
			acc[job] = [name];
		} else if (!acc[job].includes(name)) {
			acc[job].push(name);
		}
		return acc;
	}, {});

	// const result = Object.entries(crewByJob).reduce((acc, [job, names]) => {
	// 	if (names.length > 1) {
	// 		acc[job] = names.join(", ");
	// 	}
	// 	return acc;
	// }, {});

	// console.log("result", result);
	return Object.entries(crewByJob);
};

async function doFetch(url) {
	try {
		let res = await fetch(url);
		let result = await res.json();
		return result;
	} catch (error) {
		console.log(error.message);
		return error;
	}
}

export {
	search,
	getEpisodes,
	getShowDetails,
	getWatchProvider,
	getYear,
	getLanguage,
	getImageURL,
	getFormattedShowDetails,
	getFormattedMovieDetails,
	searchGenre,
	getGenre,
	getGenreText,
	getSpokenLanguage,
	getFormattedCrew,
};
