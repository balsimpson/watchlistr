import { initializeApp } from "firebase/app";
import { getDocsMatchingGenre } from "~~/composables/useFirebase";

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.private.FIREBASE_API_KEY,
    projectId: config.private.FIREBASE_PROJECT_ID,
  };

  // console.log(query)
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  if (query.genre) {
    // @ts-ignore
    let res = await getDocsMatchingGenre("media", query.genre)
    // console.log(res)
    return res
  }
})