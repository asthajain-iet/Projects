import React, { useContext, useEffect, useState } from 'react'
import './chatbox.css'
import assets from '../../assets/assets'
import { Appcontext } from '../../context/Appcontext'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { toast } from 'react-toastify'
const Chatbox = () => {

  const { userData ,chatuser, messagesId ,messages , setMessages , chatData } = useContext(Appcontext);
  const [input,setInput]=useState("");
  const sendMessage = async ()=>{
    console.log("1");
    try {
      if(input && messagesId){
        console.log("2");
        await updateDoc(doc(db,'messages',messagesId),{
          messages: arrayUnion({
            sId : userData.id,
            text: input,
            createdAt: new Date()
          })
        })
        console.log("3");
        const userIDs = [chatuser.id, userData.id];
        userIDs.forEach(async (id)=>{
          console.log("4");
           const userChatRef= doc(db,'chats',id);
           const userChatSnapshot = await getDoc(userChatRef);

           if(userChatSnapshot.exists()){
            console.log("5");
            const userchatData = userChatSnapshot.data();
            if (userchatData && Array.isArray(userchatData.chatData)) {
              console.log("6");
              const chatIndex = userchatData.chatData.findIndex((c) => c.messageId === messagesId);
              console.log(chatIndex);
              
             
                if (input) {
                  console.log("7");
                    userchatData.chatData[chatIndex].lastMessage = input.slice(0, 30);
                    console.log(userchatData.chatData[chatIndex].lastMessage);
                } else {
                    console.error("Input is undefined");
                }
                userchatData.chatData[chatIndex].updatedAt = Date.now();
            
                if (userchatData.chatData[chatIndex].rId === userData.id) {
                  console.log("8");
                    userchatData.chatData[chatIndex].messageSeen = false;
                 }
                
              
                await updateDoc(userChatRef, {
                    chatData: userchatData.chatData,
                });
              
            } else {
              console.error("chatData is undefined");
            }
            setInput("");
           }
        })
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message)
    }
  }
  const convertTimeStamp = (timeStamp)=>{
     let date = timeStamp.toDate();
     let hours = date.getHours();
     let minutes = date.getMinutes();
     if(hours>12){
      return hours-12 + ":" + minutes + "PM"; 
     }
     else{
       return hours + ":" + minutes + "AM";
     }
  }

  useEffect(()=>{
      if(messagesId){
        const unSub = onSnapshot(doc(db,'messages',messagesId), (res)=>{
            setMessages(res.data().messages.reverse());
            console.log(res.data().messages.reverse())
        })
        return ()=>{
          unSub();
        }
      }
  },[messagesId])

  return chatuser?(
    <div className="chat-box">
      <div className="chat-user">
        <img src={chatuser.avatar?chatuser.avatar:assets.Profile} alt="" className="profile1" />
        <div className="name">
        <p>{chatuser.name}</p> 
        <p className='now'>Active Now</p>
        </div>
        <img src={assets.greendot} alt="" className="active" />
        <img src={assets.help} alt="" className="help" />
      </div>
       
      <div className="chat-msg">

         {messages.map((msg,index)=>{
          return (
            <div key={index} className={msg.sId===userData.id ? "s-msg" : "r-msg"} >
            <div className="msg">
              <p >{msg.text}</p>
              <p className='time'>{convertTimeStamp(msg.createdAt)}</p>
            </div>
            <img src={msg.sId===userData.id ? userData.avatar : chatuser.userData.avatar} alt="" className="profilechat" />
          </div>
          );
         })}
         
      </div>

      <div className="chat-input">
        <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Send a Message'/>
        <input type="file" id='gallery' accept='image/png,gallery/jpeg' hidden/>
        <label htmlFor="gallery">
          <img src={assets.gallery} alt="" className="gallery" />
        </label>
        <img onClick={sendMessage} src={assets.send} alt="" className="send" />
      </div>

    </div>
  ):
  <div className="welcome">
    <img src={assets.logo} alt="" className="logo" />
    <p>Chat Anytime! Anywhere</p>
  </div>
}

export default Chatbox