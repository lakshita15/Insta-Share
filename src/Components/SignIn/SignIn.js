import React,{useState , useContext , useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import {AuthContext} from '../../Context/AuthProvider'


// 1. Email
// 2.password
function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const[error,setError] = useState('');
    const[loading,setLoading] = useState(false);
    const {login , CurrentUser}= useContext(AuthContext) 
    //use history ek hook hai ye history ka access de dega isme push ki property aati hai jo route ke url ko change krati hai 
    const history = useHistory()   
    const handleSubmit= async(e)=>{
        console.log('hiii');
        e.preventDefault();
        try{
            console.log('Logging in user')
            setLoading(true);
            await login(email, password)
            setLoading(false)
            //jese submit thik se chlgya 
            history.push('/')
        }catch{
            setError("Failed to log in")
          setTimeout(()=>setError(''),2000)
          setLoading(false)
        }
    }
    //if i'm logged in i should nt access login page 
    //ue 2nd variation
    useEffect(()=>{
        if(CurrentUser)
        {
           history.push('/') //REDIRECT TO FEEDS PAGE
        }
      },[])
    return (
        <div className = "login-container">
        <form onSubmit={handleSubmit} >
       <div>
          <label htmlFor=''>Email</label>
              <input type='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
          </div>
          <div>
          <label htmlFor=''>Password</label>
              <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
          </div>
          <button type='submit' disabled={loading}>Login</button>
          {error?<h1>{error}</h1>:<></>}
          </form>
         
         {/* <div className="image">
             <img src= {img}></img>
         </div> */}
  </div>
    )
}

export default SignIn
