import React , {useContext , useEffect , useState}from 'react'
import { Link } from "react-router-dom";
import { useHistory } from 'react-router-dom';
import {AuthContext} from '../../Context/AuthProvider'
import UploadFile from '../Upload/UploadFile';
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Badge from '@material-ui/core/Badge';
import "./Header.css"

import ForumIcon from '@material-ui/icons/Forum';

import { storage ,database } from '../../firebase';
import { Avatar } from '@material-ui/core';
export default function Header() {
    const[error,setError] = useState('');
    const[loading,setLoading] = useState(false);
    const {logout}= useContext(AuthContext)   
    const {CurrentUser}=  useContext(AuthContext);
    const history = useHistory()   
    const [userData, setuserData] = useState(null)
     const handleSubmit= async(e)=>{
        try{
            console.log('Logging out user')
            setLoading(true);
            await logout()
            setLoading(false)
            //jese submit thik se chlgya 
            history.push('/login')
        }catch{
            setError("Failed to log in")
          setTimeout(()=>setError(''),2000)
          setLoading(false)
        }
    }
    const goToChat=()=>{
      history.replace('/chat');
    }
    useEffect(() => {
        const unsub = database.users.doc(CurrentUser.uid)
    .onSnapshot((doc)=>{
      console.log(doc.data());
      setuserData(doc.data());
    })    
      }, [CurrentUser])
    
    return (
      <section className="header">
        <div className="image"><img  onClick={()=>{history.push('/')}} src = "2021-09-14_02_41_38-Wix_Logo_Maker-removebg-preview.png"/>
</div>
<div className="controls">

{userData && userData.profileUrl && userData.userName &&(


  <Avatar userData={userData} onClick={()=>{history.push('/profile')}} src={userData.profileUrl}></Avatar>

)}
        <button type='submit' onClick={handleSubmit} disabled={loading}>Logout</button>
        <IconButton aria-label="show 4 new mails" color="inherit" onClick={goToChat} >
              <Badge color="secondary" >
               <ForumIcon size="large" />
              </Badge>
            </IconButton>
        <UploadFile userData={userData}/>
</div>
      </section>
        
       
    )
}

