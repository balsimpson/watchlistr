import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getDocMatchingTitle } from "~~/composables/useFirebase";

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.private.FIREBASE_API_KEY,
    projectId: config.private.FIREBASE_PROJECT_ID,
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // console.log(query.slug)
  if (query.search) {
    // @ts-ignore
    return await getDocMatchingTitle("media", query.search)
  }
})