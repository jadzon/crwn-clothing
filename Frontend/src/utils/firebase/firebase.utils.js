import {initializeApp} from 'firebase/app';
import {getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword} from 'firebase/auth';
import{
    getFirestore,
    doc,
    getDoc,
    setDoc
}from 'firebase/firestore'
const firebaseConfig = {
    apiKey: "AIzaSyDlpaKW78AMnDK1MI1e7tR75gwwPIJJS1Q",
    authDomain: "crwn-clothing-1ccfa.firebaseapp.com",
    databaseURL: "https://crwn-clothing-1ccfa-default-rtdb.firebaseio.com",
    projectId: "crwn-clothing-1ccfa",
    storageBucket: "crwn-clothing-1ccfa.appspot.com",
    messagingSenderId: "668124220081",
    appId: "1:668124220081:web:84fcd58c5320f410017090"
  };

  // Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
provider.setCustomParameters(
    {
        prompt: "select_account"
    }
);
export const auth = getAuth();
export const signInWithGooglePopup = ()=> signInWithPopup(auth, provider);
export const db = getFirestore();
export const createUserDocumentFromAuth = async (userAuth) => {
    const userDocRef = doc(db,'users',userAuth.uid)
    console.log(userDocRef);
    const userSnapshot = await getDoc(userDocRef);
    console.log(userSnapshot);  
    console.log(userSnapshot.exists());
    if(!userSnapshot.exists()){
        const {displayName,email} = userAuth;
        const createdAt = new Date();
        try{
            await setDoc(userDocRef, {
                displayName,
                email,
                createdAt,
            });
        }catch(error){
            console.log('error create\ing the user', error.message);
        }
    }
    return userDocRef;
}
export const createAuthUserWithEmailAndPassword = async (email,password) => {
    if(!email||!password)return;
    return await createUserWithEmailAndPassword(auth,email,password);
}