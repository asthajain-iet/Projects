// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signOut } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth/cordova";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
const firebaseConfig = {
  apiKey: "AIzaSyAzBDGCKvN-iJmkUwBqBd_BiGah9TXoKds",
  authDomain: "chat-app-gs-ceff5.firebaseapp.com",
  projectId: "chat-app-gs-ceff5",
  storageBucket: "chat-app-gs-ceff5.appspot.com",
  messagingSenderId: "36767935816",
  appId: "1:36767935816:web:5231b194ae86eafb20177d"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app);
const db=getFirestore(app);

const signup = async (username,email,password) => {
     try {
        const res= await createUserWithEmailAndPassword(auth,email,password );
        const user=res.user;
        const chat=res.chat;
        await setDoc(doc(db,"users",user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey there, I'm using Chat App",
            lastSeen:Date.now()
        })
        await setDoc(doc(db,"chats",user.uid),{
            chatData:[]
        })
     } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "))
     }
}
const login=async (email,password)=>{
    try {
        await signInWithEmailAndPassword(auth,email,password);
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}
const logout=async ()=>{
    try {
        await signOut(auth);
    } catch (error) {
        console.error(error);
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}
export {signup,login,logout,auth,db}
