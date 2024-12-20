import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const Appcontext = createContext();

const AppcontextProvider= (props) => {
    
    const navigate=useNavigate();
    const [userData,setuserData] =useState(null);
    const [chatData,setchatData] =useState(null);
    const [messagesId, setmessagesId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatuser, setChatuser] = useState(null);



    const loadUserData = async (uid) => {
        try {
          const userRef = doc(db, 'users', uid);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
      
          if (userData) {
            setuserData(userData);
            if (userData.avatar && userData.name) {
              navigate('/chat');
            } else {
              navigate('/profile');
            }
      
            // Update last seen
            await updateDoc(userRef, {
              lastSeen: Date.now(),
            });
      
            // Set interval to update last seen every 6 seconds
            setInterval(async () => {
              if (auth.chatUser) {
                await updateDoc(userRef, {
                  lastSeen: Date.now(),
                });
              }
            }, 60000);
          }
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      };
      
      useEffect(() => {
        if (userData && chatData && chatData.id) {
          const chatRef = doc(db, 'chats', chatData.id);  // Check if chatData and chatData.id exist
          const unSub = onSnapshot(chatRef, async (res) => {
            const chatItems = res.data()?.chatData;  // Check if res.data() exists
            if (chatItems) {
              const tempData = [];
      
              // Loop through chat items and fetch user data
              for (const item of chatItems) {
                try {
                  const userRef = doc(db, 'users', item.rId);  // Ensure item.rId is valid
                  const userSnap = await getDoc(userRef);
                  const userData = userSnap.data();
      
                  // Only push valid user data
                  if (userData) {
                    tempData.push({ ...item, userData });
                  }
                } catch (error) {
                  console.error('Error fetching user data:', error);
                }
              }
      
              // Sort by updatedAt if it exists and set chat data
              setchatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
            }
          });
      
          // Cleanup the snapshot listener when the component unmounts or userData/chatData changes
          return () => {
            unSub();
          };
        }
      }, [userData, chatData]);  // Re-run the effect when userData or chatData changes
      

    const value ={
        userData,setuserData,
        chatData,setchatData ,
        loadUserData,
        messagesId,setmessagesId,
        messages,setMessages,
        chatuser,setChatuser
    }

    return (
        <Appcontext.Provider value={value}>
            {props.children}
        </Appcontext.Provider>
    )
}

export default AppcontextProvider;