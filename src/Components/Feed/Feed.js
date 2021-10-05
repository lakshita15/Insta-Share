import React, {useContext,useState, useEffect} from 'react'
import Header from '../Header/Header'
import {AuthContext} from "../../Context/AuthProvider"
import './Feed.css'
import Suggested from '../Suggested-Users/Suggested'
import Posts from '../Posts/Posts'
import UploadFile from '../Upload/UploadFile'
import { database } from '../../firebase';
import CircularProgress from '@material-ui/core/CircularProgress';
function Feed() {
  const {CurrentUser}=  useContext(AuthContext);
  const [userData, setuserData] = useState(null)
  //data fetch => from firestore
  //fetching in useeffect , in the variation if curr user change , to refresh to dependency array non empty for security ressons. kuki currr user pe depend krta hai, is user pe ek snapshot , ab app use krre ab user ne profile pic bdl di , ab we want ki ye chng data me aa jaye nrml fetch na krke snapshot attach like observe fnc
  //cleanup fnc
  //database me se users ka collection chahiye , isme se hume doc mngana hai cuuruser.uid vala doc , agr iski info me koi change aaye to vo update le aaye like real time change on snapshot it attatches a listener for document snapshot events. jb chng ye vapas se call ek fnc me doc milega and isko log krake fileurl , userid , uska name , created at date aa jayega {userId: '5G29ObEG9KhzqDSMkzdC3ozxyMr1', email: 'lakshita2001@gmail.com', postId: Array(0), createdAt: t, userName: 'lakshita', …}createdAt: t {seconds: 1630732710, nanoseconds: 886000000}email: "lakshita2001@gmail.com"postId: []profileUrl: "https://firebasestorage.googleapis.com/v0/b/reelsapp-c2ff4.appspot.com/o/users%2F5G29ObEG9KhzqDSMkzdC3ozxyMr1%2FprofileImage?alt=media&token=a6d7ee63-20e5-452f-bd05-6e2e796954ed"userId: "5G29ObEG9KhzqDSMkzdC3ozxyMr1"userName: "lakshita"[[Prototype]]: Object
  
  //jb tk header and user data null tab tk post & header ko render krana is useless

  useEffect(() => {
  const unsub = database.users.doc(CurrentUser.uid).onSnapshot((doc)=>{

  console.log(doc.data());
  setuserData(doc.data());
  
})    
  }, [CurrentUser])
    return (
        <>
        {userData==null ? <CircularProgress />:
        <>
        {/* image aayegi  userdata.profileURL */}
        <Header userData={userData}/>  
        <div style={{height:'1.5vh'}}/>
        <div className='feed-container'>
            <div className='center'>
                <Posts userData={userData}/>
                <Suggested userData={userData}/>
            </div>
        </div>   
        </>
        }
        </>
    )
}
 
export default Feed

//1. signup doc ,  