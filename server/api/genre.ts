import { initializeApp } from "firebase/app";
import { getDocsMatchingGenre } from "~~/composables/useFirebase";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const config = useRuntimeConfig();

	const firebaseConfig = {
		apiKey: config.private.FIREBASE_API_KEY,
		projectId: config.private.FIREBASE_PROJECT_ID,
	};

	// console.log(query)
	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
	if (query.count) {
		// @ts-ignore
		return await getDocsMatchingGenre(
			"media",
			query.genre,
			"created_at",
			query.count
		);
	}

	// @ts-ignore
	return await getDocsMatchingGenre("media", query.genre, "created_at");
});
