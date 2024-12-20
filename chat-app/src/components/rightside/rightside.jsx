import React from 'react'
import './rightside.css'
import assets from '../../assets/assets'
import { logout } from '../../config/firebase'
const rightside = () => {
  return (
    <div className='rs'>
      <div className='rs-profile'>
      < img src={assets.profile1} alt="" className="profile" />
        <h3>Astha Jain <img src={assets.greendot} alt="" className="active" /> </h3>
        <p>Hello! This is Astha. </p>
      </div>
      <div className="rs-media">
        <p>Media</p>
        <div className="media">
        <img src={assets.pic1} alt="" />
        <img src={assets.pic1} alt="" />
        <img src={assets.pic1} alt="" />
        <img src={assets.pic1} alt="" />
        </div>
      </div>
      <div className="logout">
      <button onClick={()=>logout()} >LOGOUT <img src={assets.logout} alt="" className="logout" /> </button>
      
      </div>
     
      
    </div>
  )
}

export default rightside