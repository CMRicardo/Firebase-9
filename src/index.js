import { initializeApp } from 'firebase/app'
import {
	getFirestore,
	collection,
	onSnapshot,
	addDoc,
	deleteDoc,
	doc,
	query,
	where,
	orderBy,
	serverTimestamp,
	getDoc,
	updateDoc,
} from 'firebase/firestore'
import {
	getAuth,
	createUserWithEmailAndPassword,
	signOut,
	signInWithEmailAndPassword,
	onAuthStateChanged,
} from 'firebase/auth'

const firebaseConfig = {
	apiKey: 'AIzaSyAVjYs05pHNsssYN5l9FfFYtdwQUfrb5Zg',
	authDomain: 'fir-9-dojo-4207a.firebaseapp.com',
	projectId: 'fir-9-dojo-4207a',
	storageBucket: 'fir-9-dojo-4207a.appspot.com',
	messagingSenderId: '173915036791',
	appId: '1:173915036791:web:793ff89e3c6453b61c3a72',
}

// init firebase app
initializeApp(firebaseConfig)

// init services
const db = getFirestore()
const auth = getAuth()

// collectionRef
const colRef = collection(db, 'books')

// queries
const q = query(colRef, orderBy('createdAt'))

// get collection data
const unSubCol = onSnapshot(q, snapshot => {
	let books = []
	snapshot.docs.forEach(doc => {
		books.push({ ...doc.data(), id: doc.id })
	})
	console.log(books)
})

// Adding documents
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', e => {
	e.preventDefault()

	addDoc(colRef, {
		title: addBookForm.title.value,
		author: addBookForm.author.value,
		createdAt: serverTimestamp(),
	}).then(() => {
		addBookForm.reset()
	})
})

// Deleting documents
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', e => {
	e.preventDefault()

	const docRef = doc(db, 'books', deleteBookForm.id.value)
	deleteDoc(docRef).then(() => {
		deleteBookForm.reset()
	})
})

// Get a single document
const docRef = doc(db, 'books', 'tS6ZxNQ0U3gJrZjw1aeN')
const unSubDoc = onSnapshot(docRef, doc => {
	console.log(doc.data(), doc.id)
})

// Updating documents
const updateBookForm = document.querySelector('.update')
updateBookForm.addEventListener('submit', e => {
	e.preventDefault()

	const docRef = doc(db, 'books', updateBookForm.id.value)

	updateDoc(docRef, {
		title: 'updated title',
	}).then(() => {
		updateBookForm.reset()
	})
})

// Signing users up
const signUpForm = document.querySelector('.signup')
signUpForm.addEventListener('submit', e => {
	e.preventDefault()

	const email = signUpForm.email.value
	const password = signUpForm.password.value
	createUserWithEmailAndPassword(auth, email, password)
		.then(cred => {
			// console.log('user created: ', cred.user)
			signUpForm.reset()
		})
		.catch(err => console.log(err.message))
})

// Login and Logout
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
	signOut(auth)
		.then(/*console.log('The user signed out')*/)
		.catch(err => console.log(err.message))
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', e => {
	e.preventDefault()

	const email = loginForm.email.value
	const password = loginForm.password.value
	signInWithEmailAndPassword(auth, email, password)
		.then(cred => {
			// console.log('User logged in:', cred.user)
		})
		.catch(err => console.log(err.message))
})

// Subscribe to auth changes
const unSubAuth = onAuthStateChanged(auth, user => {
	console.log('User state change: ', user)
})

// Unsubscribe from changes
const unsubscribeBtn = document.querySelector('.unsubscribe')
unsubscribeBtn.addEventListener('click', () => {
	console.log('Unsubscribing')
	unSubCol()
	unSubDoc()
	unSubAuth()
})
