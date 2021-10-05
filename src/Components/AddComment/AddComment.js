import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './AddComment.css'
import { database } from '../../firebase';

const useStyles = makeStyles({
cbtn:{
    marginRight:'1%',
    marginLeft:'4%'    
}
})
function AddComment({userData=null , postData=null}) {  
    const classes = useStyles();
    const[text,setText] = useState("")
    const manageText=(e)=>{  
        let comment = e.target.value
        setText(comment)
    }
    const handleOnEnter=()=>{
        let obj ={
            text:text,
            uName:userData.userName,
            uUrl:userData.profileUrl
        }
        //  console.log(obj);
         //obj ==> {text: 'heelohhh', uName: 'lakshita', uUrl: 'https://firebasestorage.googleapis.com/v0/b/reelsa…=media&token=a6d7ee63-20e5-452f-bd05-6e2e796954ed'}
            // text: "heelohhh"
            // uName: "lakshita"
            // uUrl: "https://firebasestorage.googleapis.com/v0/b/reelsapp-c2ff4.appspot.com/o/users%2F5G29ObEG9KhzqDSMkzdC3ozxyMr1%2FprofileImage?alt=media&token=a6d7ee63-20e5-452f-bd05-6e2e796954ed"

        database.comments.add(obj).then(docRef=>{
            database.posts.doc(postData.postId).update({
                comments:[...postData.comments,docRef.id]
            })
        })
        .catch(e=>{
            console.log(e+" ");
        })
        setText("");
    }
    return (
        <div className='emojibox'>
            <TextField  value={text} fullWidth={true} label='add comment' onChange={manageText}/>
            <Button onClick={handleOnEnter} disabled={text==""?true:false} className={classes.cbtn} color='primary' >
                post
            </Button>
        </div>
    )
}

export default AddComment
