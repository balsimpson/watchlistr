import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getDocsFromFirestore, getDocFromFirestoreWithSlug } from "~~/composables/useFirebase";

export default defineEventHandler(async (event) => {
  // const config = useRuntimeConfig()
  // const body = await readBody(event)
  const query = getQuery(event)

  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.private.FIREBASE_API_KEY,
    projectId: config.private.FIREBASE_PROJECT_ID,
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  
  if (query.slug) {

    // increment page view

    // @ts-ignore
    return await getDocFromFirestoreWithSlug("items", query.slug)
  }

  return await getDocsFromFirestore("items")
})