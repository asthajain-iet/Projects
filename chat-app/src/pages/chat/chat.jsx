import React from 'react'
import './chat.css'
import Leftside from '../../components/leftside/leftside'
import Chatbox from '../../components/chatbox/Chatbox'
import Rightside from '../../components/rightside/rightside'
const chat = () => {
  return (
    <div className='chat'>
      <div className="chat-container">
        < Leftside />
        <Chatbox />
        <Rightside />
      </div>
    </div>
  )
}

export default chat