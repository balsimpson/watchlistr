import {
	getAuth,
	signInWithEmailAndPassword,
	onAuthStateChanged,
} from "firebase/auth";
import {
	addDoc,
	setDoc,
	collection,
	getFirestore,
	getDocs,
	getDoc,
	doc,
	query,
	orderBy,
	where,
	limit,
	DocumentData,
	Query,
	increment,
} from "firebase/firestore";

export const signInUser = async (email: string, password: string) => {
	const auth = getAuth();
	const credentials = await signInWithEmailAndPassword(
		auth,
		email,
		password
	).catch((error) => {
		const errorCode = error.code;
		const errorMessage = error.message;
		console.log(errorCode, errorMessage);

		if (errorCode === "auth/user-not-found") {
			return "You are not authorised.";
		}
		if (errorCode === "auth/wrong-password") {
			return "Wrong password";
		}
		if (errorCode === "auth/too-many-requests") {
			return "Too many requests";
		}
		if (errorCode === "auth/user-disabled") {
			return "User disabled";
		}
		if (errorCode === "auth/invalid-email") {
			return "Invalid email";
		}
		if (errorCode === "auth/email-already-in-use") {
			return "Email already in use";
		}
		if (errorCode === "auth/invalid-credential") {
			return "Invalid credential";
		}
	});
	return credentials;
};

/**
 * Get a single document from a collection where slug
 * @param {String} collectionName - collection name
 * @param {String} slug - document id
 * @example getDocFromFirestoreWithSlug('posts', 'title-slug')
 */
export const getDocFromFirestoreWithSlug = async (
	collectionName: string,
	slug: string
) => {
	try {
		const db = getFirestore();
		const q = query(collection(db, collectionName), where("slug", "==", slug));
		const querySnapshot = await getDocs(q);
		let item: DocumentData;
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			// console.log(doc.id, " => ", doc.data());
			item = doc.data();
			item.id = doc.id;
		});

		// @ts-ignore
		return item;
	} catch (error) {
		console.log("getDocFromFirestore-error", error);
		return error;
	}
};

/**
 * Get documents from a collection
 * @param {String} collectionName - name of the collection
 * @returns {Array} array of items
 * @example getDocsFromFirestore('products', 'published_at')
 */
export const getDocsFromFirestore = async (collectionName: string) => {
	try {
		const db = getFirestore();
		// const q = query(collection(db, collectionName), orderBy("release_date", "desc"));
		let items: DocumentData[] = [];
		let q = query(collection(db, collectionName));

		let res = await getDocs(q);
		res.forEach((doc) => {
			let newdoc = doc.data();
			newdoc.uid = doc.id;
			items.push(newdoc);
		});
		return items;
	} catch (error) {
		console.log("firebase-error", error);
		return error;
	}
};

export const initUser = async () => {
	const auth = getAuth();
	const firebaseUser = useFirebaseUser();
	// @ts-ignore
	firebaseUser.value = auth.currentUser;

	const userCookie = useCookie("userCookie");

	const router = useRouter();

	onAuthStateChanged(auth, (user) => {
		if (user) {
			// User is signed in, see docs for a list of available properties
			// console.log("user signed in")
			// router.push("/admin");
			// https://firebase.google.com/docs/reference/js/firebase.User
		} else {
			// console.log("user signed out")
			// router.push("/admin/signin");
			//if signed out
		}

		// @ts-ignore
		firebaseUser.value = user;

		// @ts-ignore
		userCookie.value = user; //ignore error because nuxt will serialize to json

		$fetch("/api/auth", {
			method: "POST",
			body: { user },
		});
	});
};

/**
 * Add a document to a collection
 * @param {string} collectionName - collection name
 * @param {object} doc - document to add
 * @example addDocToFirestore('products', { title: "test", body: "test" })
 */
export const addDocToFirestore = async (collectionName: string, doc: any) => {
	try {
		const db = getFirestore();
		const docRef = await addDoc(collection(db, collectionName), doc);
		console.log("Document written with ID: ", docRef.id);
		return docRef;
	} catch (error) {
		console.log("firebase-error", error);
		return error;
	}
};

export const signOutUser = async () => {
	const auth = getAuth();
	const result = await auth.signOut();
	return result;
};
