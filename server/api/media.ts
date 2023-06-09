import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import {
	getDocMatchingTitle,
	getOrderedDocsFromFirestore,
	getDocFromFirestoreWithSlug,
} from "~~/composables/useFirebase";

export default defineEventHandler(async (event) => {
	const query = getQuery(event);
	const config = useRuntimeConfig();

	const firebaseConfig = {
		apiKey: config.private.FIREBASE_API_KEY,
		projectId: config.private.FIREBASE_PROJECT_ID,
	};

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);

	if (query.search) {
		// console.log(query.search);
		// @ts-ignore
		return await getDocMatchingTitle("media", query.search);
	} else if (query.slug) {
		// console.log(query.slug);
		// @ts-ignore
		return await getDocFromFirestoreWithSlug("media", query.slug);
	} else {
		// @ts-ignore
    return await getOrderedDocsFromFirestore("media", "created_at")
  }
  
});
