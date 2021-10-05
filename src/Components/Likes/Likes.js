import React,{useState,useEffect} from 'react'
import FavoriteIcon from '@material-ui/icons/Favorite';
import { makeStyles } from '@material-ui/styles';
import { database } from '../../firebase';
import { mergeClasses } from '@material-ui/styles';

const useStyles = makeStyles({
    like:{
        color:'#e74c3c',
        cursor:'pointer'
    },
    unlike:{
        color:'#9292922e',
        cursor:'pointer'
    }
})
//2 props aare hai userdata aur postdata dono initailluy null,agr curr array me user ki id hai mtlb user ne like kia hua hai //request in  a useeffect 
function Likes({userData=null,postData=null}) {

    const [like, setLike] = useState(null)
    const classes = useStyles();
    const handleLike= async()=>{
        if(like==true){
            //unlike
            let uarr = postData.likes.filter(el=>{
                return el!=userData.userId
            })
            await database.posts.doc(postData.postId).update({
                likes:uarr
            })
        }else{
            //like
            let uarr = [...postData.likes,userData.userId];
            await database.posts.doc(postData.postId).update({
                likes:uarr
            })
        }
    }
    //initially like null hai,jb tk like null tb tk show nothing
    //useeffect depend on postdata 
    //check krna hai ki post data ke likes arr vale me user ki id hai ya ni..userdata me user id hai
    //manlo ye false to white aayega in case kisi ne like krdia to hum usko like array me add , manlo empty rkha to ye ek baar chlta 
    useEffect(() => {

     let check = postData.likes.includes(userData?.userId)?true:false;
     setLike(check)
     
    }, [postData]) 

    return (
        <div>
           {
               like!=null?<>
               {like==false? <FavoriteIcon
                className={`${classes.unlike} icon-styling`} 
                onClick = {handleLike}
                />
                :
              <FavoriteIcon  className={`${classes.like} icon-styling`} 
               onClick = {handleLike}
               />}
               </>
               :<></>
           }
        </div>
    )
}

export default Likes
