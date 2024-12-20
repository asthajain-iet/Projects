import React, { useContext, useState } from 'react'
import './leftside.css'
import Assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { Appcontext } from '../../context/Appcontext'
import { toast } from 'react-toastify'
const Leftside = () => {

  const navigate = useNavigate();
  const { userData, chatData ,chatuser, setChatuser ,setmessagesId, messagesId } = useContext(Appcontext);
  const [user, setUser] = useState(null);
  const [showSearch, setshowSearch] = useState(false);
  
  const inputHandler = async (e) => {
    try {
      const input = e.target.value;
      if (input) {
        setshowSearch(true);
        const userRef = collection(db, 'users');
        const q = query(userRef, where("username", "==", input.toLowerCase()));
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
            setUser(querySnap.docs[0].data());
        }
        else {
          setUser(null);
        }
      }
      else {
        setshowSearch(false);
      }
    } catch (error) {

    }
  }

  const addChat = async () => {
    
    const messageRef = collection(db, "messages");
    const chatRef = collection(db, "chats");
    try {
      const newMessageRef = doc(messageRef);
      await setDoc(newMessageRef, {
        createAt: serverTimestamp(),
        messages: []
      });
  
      // Update the chat for the searched user
      await updateDoc(doc(chatRef, user.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      });
  
      // Update the chat for the current user
      await updateDoc(doc(chatRef, userData.id), {
        chatData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      });
  
      // Set the chat user and messages ID after the chat is created
      setChatuser({
        id: user.id,
        name: user.name,
        avatar: user.avatar
      }); // Set chat user data here
      setmessagesId(newMessageRef.id); // Set the messages ID here
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  }
  
  const setChat = (item) => {
    setmessagesId(item.messageId);
    setChatuser(item.userData); // Use userData to set chat user
    //console.log(item);
  }
  
  return (
    <div className='ls'>
      <div className="ls-top">
        <div className="ls-nav">
          <img src={Assets.logo} alt="" className="logo" />
          <div className="ls-menu">
            <img src={Assets.Menu} alt="" className="menu" />
            <div className="sub-menu">
              <p onClick={() => navigate('/profile')}>Edit Profile</p>
              <hr />
              <p onClick={() => navigate('/')}>Logout</p>
            </div>
          </div>
        </div>
        <div className="ls-search">
          <img src={Assets.Search} alt="" className="search" />
          <input onChange={inputHandler} type="text" placeholder='Search Here..' />
        </div>
      </div>
      <div className="ls-list">
        {showSearch && user ? ( // Corrected `showSearch` check (not `setshowSearch`)
          <div onClick={ addChat } className='friends-add-user'>
            <img src={user.avatar || Assets.Profile} alt="profile" className="profile-ls" />
            <div>
            <p>{user.name}</p>
            
            </div>
          </div>
          ) 
          : (chatData ?
          
            chatData.map((item,index) => (
              console.log("1"),
              <div key={index} onClick={() => setChat(item)} className='friends'>
                <img src={item.userData.avatar || Assets.Profile} alt="profile" className="profile-ls" />
                <div>
                  <p>{item.userData.name}</p>
                </div>
              </div>
            )):
            <p>Not Available</p>
          )
            
          }
          

      </div>

    </div>
  )
}

export default Leftside