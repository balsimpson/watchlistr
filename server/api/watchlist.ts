import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getSubcollectionFromFirestore } from "~~/composables/useFirebase";

export default defineEventHandler(async (event) => {
	const { user } = getQuery(event);
	const config = useRuntimeConfig();

	const firebaseConfig = {
		apiKey: config.private.FIREBASE_API_KEY,
		projectId: config.private.FIREBASE_PROJECT_ID,
	};

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);

    // @ts-ignore
	return await getSubcollectionFromFirestore(user, "users", "watchlist");
});
