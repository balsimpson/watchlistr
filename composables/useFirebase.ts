import {
	getAuth,
	signInWithEmailAndPassword,
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithPopup,
	createUserWithEmailAndPassword,
	updateProfile,
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
	deleteDoc,
	updateDoc,
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
		// console.log(errorCode, errorMessage);

		if (errorCode === "auth/user-not-found") {
			return "Call sheet doesn't include your name. Register now!";
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
 * Sign in with google
 * @param {string} signinProvider - signin provider
 * @returns {object} user Object
 */
export const socialSignIn = async (signinProvider: string) => {
	const auth = getAuth();
	const googleProvider = new GoogleAuthProvider();
	let provider;
	switch (signinProvider) {
		case "google":
			provider = googleProvider;
			provider.addScope("profile");
			provider.addScope("email");
			break;
	}

	try {
		// @ts-ignore
		let res = await signInWithPopup(auth, provider);
		// console.log("res", res);
		return res;
	} catch (error) {
		console.log("error", error);
	}
};

export const createUser = async (
	email: string,
	password: string,
	displayName: string
) => {
	const auth = getAuth();
	const credentials = await createUserWithEmailAndPassword(
		auth,
		email,
		password
	).catch((error) => {
		const errorCode = error.code;
		const errorMessage = error.message;
	});

	// @ts-ignore
	if (credentials.user) {
		// @ts-ignore
		let res = await updateProfile(auth.currentUser, {
			displayName,
			photoURL: "",
		});
	}
	return credentials;
};

/**
 * update user profile
 * @param {string} displayName - display name to update
 * @param {string} photoURL - display picture to update
 * @example updateUserProfile("name", "someurl")
 */
export const updateUserProfile = async (
	displayName: string,
	photoURL: string
) => {
	try {
		const auth = getAuth();
		// @ts-ignore
		let res = await updateProfile(auth.currentUser, { displayName, photoURL });
		return res;
	} catch (error) {
		console.log("updateUserProfile-error", error);
		return error;
	}
};

/**
 * Get a single document from a collection where slug
 * @param {String} collectionName - collection name
 * @param {String} title - document id
 * @example getDocMatchingTitle('posts', 'title')
 */
export const getDocMatchingTitle = async (
	collectionName: string,
	title: string
) => {
	try {
		const db = getFirestore();
		const q = query(collection(db, collectionName), where("slug", ">=", title));
		const querySnapshot = await getDocs(q);
		let item: DocumentData;
		let items: any[] = [];
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			console.log(title, doc.id, " => ", doc.data());
			item = doc.data();
			item.id = doc.id;

			items.push(item);
		});

		// @ts-ignore
		return items[0];
	} catch (error) {
		console.log("getDocFromFirestore-error", error);
		return error;
	}
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
			console.log(doc.id);
			item = doc.data();
			item.uid = doc.id;
		});

		// @ts-ignore
		return item;
	} catch (error) {
		console.log("getDocFromFirestore-error", error);
		return error;
	}
};

/**
 * Get a single document from a collection where slug
 * @param {String} collectionName - collection name
 * @param {String} tag - tag name
 * @example getDocsMatchingTag('posts', 'nuxt-3')
 */
export const getDocsMatchingTag = async (
	collectionName: string,
	tag: string
) => {
	try {
		const db = getFirestore();
		const q = query(
			collection(db, collectionName),
			where("tags", "array-contains", tag)
		);
		const querySnapshot = await getDocs(q);
		let items: DocumentData[] = [];
		querySnapshot.forEach((doc) => {
			let item = doc.data();
			item.id = doc.id;
			items.push(item);
		});
		return items;
	} catch (error) {
		console.log("getDocsMatchingTag-error", error);
		return error;
	}
};

/**
 * Get a single document from a collection where genre matches
 * @param {String} collectionName - collection name
 * @param {String} genre - genre name
 * @param {String} order - order by
 * @param {Number} count - limit number of docs
 * @example getDocsMatchingGenre('media', 'mystery', 'created_at)
 */
export const getDocsMatchingGenre = async (
	collectionName: string,
	genre: string,
	order: string,
	count: number,
) => {
	try {
		const db = getFirestore();
		const q = query(
			collection(db, collectionName),
			where("genres", "array-contains", genre),
			orderBy(order, "desc"),
			limit(count)
		);
		const querySnapshot = await getDocs(q);
		let items: DocumentData[] = [];
		querySnapshot.forEach((doc) => {
			let item = doc.data();
			item.id = doc.id;
			items.push(item);
		});
		return items;
	} catch (error) {
		console.log("getDocsMatchingGenre-error", error);
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

/**
 * Get documents ordered from a collection
 * @param {String} collectionName - name of the collection
 * @param {String} order - the property to order by
 * @param {String} count - limit number of items to fetch
 * @returns {Array} array of items
 * @example getOrderedDocsFromFirestore('posts', 'created_at', 3)
 */
export const getOrderedDocsFromFirestore = async (
	collectionName: string,
	order = "created_at",
	count: number
) => {
	try {
		const db = getFirestore();
		let items: DocumentData[] = [];
		let q: Query<DocumentData>;

		if (count) {
			q = query(
				collection(db, collectionName),
				orderBy(order, "desc"),
				limit(count)
			);
		} else {
			q = query(collection(db, collectionName), orderBy(order, "desc"));
		}

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
	const firebaseItems = useFirebaseItems();
	// @ts-ignore
	firebaseUser.value = auth.currentUser;

	const userCookie = useCookie("userCookie");

	const router = useRouter();

	onAuthStateChanged(auth, async (user) => {
		if (user) {
			// User is signed in, see docs for a list of available properties
			// console.log("user signed in")
			// router.push("/admin");
			// https://firebase.google.com/docs/reference/js/firebase.User
			// firebaseItems.value = await;

			const db = getFirestore();
			let items: DocumentData[] = [];
			const q = query(
				collection(db, `users/${user.uid}/watchlist`),
				orderBy("created_at", "desc")
			);
			let res = await getDocs(q);

			res.forEach((doc) => {
				let newdoc = doc.data();
				newdoc.uid = doc.id;
				items.push(newdoc);
			});

			// @ts-ignore
			firebaseItems.value = items;
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
 * Update a document in a collection
 * @param {string} collectionName - the collection name
 * @param {string} uid - the document id
 * @param {object} data - the data to update
 * @example updateDocInFirestore('products', '123', { title: "test", body: "test" })
 */
export const updateDocInFirestore = async (collectionName: string, uid: string, data: any) => {
	try {
	  const db = getFirestore();
	  let res = await updateDoc(doc(db, collectionName, uid), data);
	  return res;
	} catch (error) {
	  console.log('updateDocInFirestore-error', error);
	  return error;
	}
  }

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

/**
 * Add a document to a sub collection
 * @param  {string} collectionName - the collection name
 * @param  {string} docId -	the document id
 * @param  {string} subcollectionName - the sub collection name
 * @param  {object} doc - the document to add
 * @example addDocToSubcollection("products", "123", "reviews", { title: "test", body: "test" })
 */
export const addDocToSubcollection = async (
	collectionName: string,
	docId: string,
	subcollectionName: string,
	doc: object
) => {
	try {
		const db = getFirestore();
		let res = await addDoc(
			collection(db, `${collectionName}/${docId}/${subcollectionName}`),
			doc
		);
		return res;
	} catch (error) {
		console.log("addDocToSubcollection-error", error);
		return error;
	}
};

/**
 * Get documents from a subcollection
 * @param {String} docId - document id
 * @param {String} collectionName - collection name
 * @param {String} subcollectionName - subcollection name
 * @returns {Array} array of subcollection items
 * @example getSubcollectionFromFirestore('123', 'products', 'reviews')
 */
export const getSubcollectionFromFirestore = async (
	docId: string,
	collectionName: string,
	subcollectionName: string
) => {
	try {
		const db = getFirestore();
		let items: DocumentData[] = [];
		const docRef = doc(db, collectionName, docId);
		const q = query(
			collection(db, `${collectionName}/${docId}/${subcollectionName}`),
			orderBy("createdAt", "desc")
		);
		let res = await getDocs(q);

		res.forEach((doc) => {
			let newdoc = doc.data();
			newdoc.uid = doc.id;
			items.push(newdoc);
		});
		return items;
	} catch (error) {
		console.log("getSubcollectionFromFirestore-error", error);
		return error;
	}
};

/**
 * Add a document to a collection
 * @param {string} collectionName - collection name
 * @param {object} doc - document to add
 * @example addDocWithId('products', { title: "test", body: "test" }, new-id)
 */
export const addDocWithId = async (
	collectionName: string,
	data: any,
	docId: string
) => {
	try {
		const db = getFirestore();
		const docRef = await setDoc(doc(db, collectionName, docId), data);
		console.log("Document written with ID: ", docRef);
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

export const checkIfDocExists = async (
	docId: string,
	collectionName: string
) => {
	const db = getFirestore();
	let docRef = doc(db, collectionName, docId);
	// @ts-ignore
	let res = await getDoc(docRef);
	console.log("res", res.data(), collectionName, docId);

	if (res.data()) {
		return true;
	}
	return false;
};

/**
 * Delete a document in a subcollection
 * @param  {string} collectionName - the name of the collection
 * @param  {string} subcollectionName - the name of the subcollection
 * @param  {string} docId - document id
 */
export const deleteDocFromSubcollection = async (
	collectionName: string,
	subcollectionName: string,
	docId: string
) => {
	try {
		const db = getFirestore();
		// const docRef = doc(db, collectionName, docId);
		const docRef = doc(db, `${collectionName}/${subcollectionName}`, docId);
		// const docRef = doc(db, `${collectionName}/${docId}/${subcollectionName}`);
		let res = await deleteDoc(docRef);
		return res;
	} catch (error) {
		console.log("deleteDocFromSubcollection-error", error);
		return error;
	}
};
/**
 * Delete a document in a collection
 * @param  {string} collectionName - the name of the collection
 * @param  {string} docId - document id
 */
export const deleteDocFromFirestore = async (
	collectionName: string,
	docId: string
) => {
	try {
		const db = getFirestore();
		const docRef = doc(db, collectionName, docId);
		let res = await deleteDoc(docRef);
		return res;
	} catch (error) {
		console.log("firebase-error", error);
		return error;
	}
};

export const incrementPageView = async (
	collectionName: string,
	uid: string
) => {
	const db = getFirestore();

	// @ts-ignore
	const docRef = doc(db, collectionName, uid);
	let res = await updateDoc(docRef, { views: increment(1) });
	// console.log(res);
	return res;
};
