import React, { useContext, useEffect, useState } from 'react'
import './profileupdate.css'
import assets from '../../assets/assets'
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from '../../libs/upload';
import { Appcontext } from '../../context/Appcontext';
const profile = () => {

  const Navigate=useNavigate();
   const [image,setImage]=useState(false);
   const [name,setName] =useState("");
   const [bio,setBio] =useState("");
   const [uid,setUid] =useState("");
   const [prevImage,setprevImage]=useState("");
   const {setuserData} =useContext(Appcontext);
   const profileupdate = async (event)=>{
       event.preventDefault();
       try {
        if(!prevImage && !image){
          toast.error("Upload Profile picture");
          return;
        }
        const docRef=doc(db,'users',uid);
        if(image){
          const imgURL=await upload(image);
          setprevImage(imgURL);
          await updateDoc(docRef,{
            avatar:imgURL,
            name:name || "",
            bio:bio || "",

          });
        }
        else{
          await updateDoc(docRef,{
            name:name || "",
            bio:bio || "",
  
          });
        }
        const snap =await getDoc(docRef);
        setuserData(snap.data());
        toast.success("Profile updated successfully");
        Navigate('/chat');
       } catch (error) {
        console.error("Error updating profile:", error);
        toast.error(error.message);
       }
   }

   useEffect(()=>{
       onAuthStateChanged(auth,async (user)=>{
         if(user){
          setUid(user.uid);
          const docRef=doc(db,'users',user.uid);
          const docSnap= await getDoc(docRef);
          if(docSnap.data().name){
            setName(docSnap.data().name);
          }
          if(docSnap.data().bio){
            setBio(docSnap.data().bio);
          }
          if(docSnap.data().avatar){
            setprevImage(docSnap.data().avatar);
          }
         }
         else{
          Navigate('/');
         }
       })
   },[])

  return (
    <div className='profileUpdate'>
      <div className="profile-details">
        <div className="profile-form">
             <form onSubmit={profileupdate}>
             <h4>User Details</h4>
             <input onChange={(e)=> setImage(e.target.files[0])} type="file" accept='/jpg ,/jpeg , /png' id="uploadimage" hidden/>
             <label htmlFor="uploadimage">
             <div className="uplo">
              <img src={image? URL.createObjectURL(image): prevImage?prevImage: assets.Profile} alt="" className="blankprofile" />
              Upload Profile
              </div>
             </label>
             <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder='Your Name' id='profilename'/>
             <input onChange={(e)=>setBio(e.target.value)} value={bio} type="text" placeholder='Your Bio' id='bio'/>
             <button type="submit">Save</button>
             </form>
        </div>
        <div>
          <img src={assets.halfback} alt="" className="halfback" />
        </div>
      </div>
    </div>
  ) 
}

export default profile