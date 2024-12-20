import React, { useState } from 'react'
import Assets from '../../assets/assets'
import './login.css'
import { signup,login } from '../../config/firebase'
const Login = () => {
     
    const [currState,setcurrState]=useState("Sign Up");
    const [userName,setUserName]=useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const onSubmitHandler = (event)=>{
          event.preventDefault();
          if(currState==="Sign Up"){
            signup(userName,email,password);
          }
          else{
            login(email,password);
          }
    }

  return (
    <div className='login'>
    <div className="form">

       <form onSubmit={onSubmitHandler} className="login-form">
        <h2>{currState}</h2>
        {currState==="Sign Up"?<input onChange={(e)=>setUserName(e.target.value)} value={userName} type="text " id='username' placeholder='Enter Username'  required/>:null}
        <input onChange={(e)=>setEmail(e.target.value)} value={email}  type="email " id='email' placeholder='Enter Email'  required/>
        <input onChange={(e)=>setPassword(e.target.value)} value={password}  type="password" id="pass" placeholder='Enter Password' required/>
        {currState==="Login"?<a href="ab">forgot password?</a>:null}
        <div className="terms">
            <input type="checkbox"/> <span>Agree to terms and conditions!</span>
        </div>
        <button type='submit'>{currState}</button>
        <div className="already">
             {currState==="Sign Up"?<p>Already have an account? <span onClick={()=>setcurrState("Login")}>Click here</span></p>:
             <p>Create an Account here : <span onClick={()=>setcurrState("Sign Up")}>Click here</span></p>}
             

        </div>
       </form>

    </div>
    </div>
  )
}

export default Login