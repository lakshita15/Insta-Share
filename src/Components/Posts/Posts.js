import React,{useState,useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
// import Ticker from 'react-ticker';
import User from '../UserProfile/User';
import Following from '../Following/Following';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import './Posts.css'
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Video from '../Videos/Video';
import { database } from '../../firebase';
import Likes from '../Likes/Likes';
import AddComment from '../AddComment/AddComment';
import Comments from '../Comments/Comments';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
    root: {
      width: '100%',
      padding: '0px'
    },
    loader: {
      position: 'absolute',
      left: '50%',
      top: '50%'
    },
    typo: {
      marginLeft: '2%'
    },
    vac: {
      marginLeft: '3.5%',
      color: '#8e8e8e',
      cursor:'pointer'
    },
    dp: {
      marginLeft: '2%'
    },
    cc: {
      height: '50vh',
      overflowY: 'auto'
    },
    seeComments:{
      height:'54vh',
      overflowY:'auto'
    },
    ci:{
    
      color: '#9292922e',
      marginLeft: '2vw',
      left:'9%',
      cursor:'pointer',
    },
    mn:{
      color:'white',
      
     
    },
    tmn:{
      color:'white'
    },
    user:{
cursor:'pointer'
      
    },
  
  });
function Posts({userData=null}) {
  const history=useHistory();
    const classes = useStyles();
    const [posts, setPosts] = useState(null);
    const [openId, setOpenId] = useState(null);
    const handleClickOpen = (id) => {
      setOpenId(id);
    };
    const handleClose = () => {
      setOpenId(null);
    };
    //callback function has entries that is basically an array
      const callback = entries=>{

        entries.forEach(element => {
          //ek element aayega entries me se , video class ka element hoga ye 
            console.log(element);
            
            let el = element.target.childNodes[0];
            //play async function => return a promise 
            el.play().then(()=>{
                //if this video is not in viewport then pause it
                if(!el.paused && !element.isIntersecting)
                {
                    el.pause();   //pause is syncronous             
                }
            })

        });
    }
    //make new intersection observer , it takes a callback fnc and optionss options basically are like root , rootmargin , threshold
    //root kuch ni denge to vo default viewport ko le lega 


    //threshold:- 
    //value range between 0-1
    //1=> 1percent
    //0.9=>90 percent 
    //kita ratio percent ek element viewport me visible in order to call the callback function 
    const observer = new IntersectionObserver(callback,{ threshold:0.85 });

    useEffect(() => {
        
        let postarr=[];
        //desc order me sort 
        const unsub = database.posts.orderBy('createdAt','desc').onSnapshot(querySnapshot=>{
            console.log("querySnapshot=>  "+ querySnapshot);
            postarr=[];
            //initially post mnga li aur addd hogai ab manlo user ne ek aur post add , ye method dobara chlega , saari post dobara aayengi agr array empty nhi kia double copy to prevent this array khali kia 
            querySnapshot.forEach((doc)=>{
             console.log(doc.data(),+"  "+doc.id);
       
                let data = {...doc.data(), postId :doc.id}
                postarr.push(data)
              })
              setPosts(postarr);
            })
        return unsub; //cleanup 

    },[])
    //cdm me post fetch , dependency is on post state while adding video jiti post utna observer add , posts chng then observer chnage jese he snapshot ki vjh se posts ki state change , new video pe bhi listender lgana pdega =>post pe dependency , post chnge , to method again run and again listener attatch kr dega 
 
    useEffect(()=>{
      //videos naam ki sab classes ko mngwa ke unpe  travel krke ek observer lgwa do.. 
        let elements = document.querySelectorAll('.videos');
        elements.forEach(el=>{
          observer.observe(el);  
        })
        //kisine ek video dali , snapshot call , postarr again bna , state change post ki , useeffcet rely on post ,new post render hua aur  new post ui pe aa gai bt listener to attatch ni hua , to listener attatch krna pdega , new use effect chlegha vo sab elements ko dobara se nikalega aur dobara se listener attach , bt already purani pe lister tha to dobara attach krne ka mtlb ni bnta hai to cleanup facility se humne observer pe lage listener ko disconnect krdia // useeffect me jo ki hai usko remove krdo 
        return ()=>{    
          observer.disconnect();
        }
      },[posts])
    return (
        <>
        <div className='place'>
        </div>
        {posts==null?<CircularProgress className={classes.loader} color="secondary" />:
        <div className='video-container' id='video-container'>
          {
              //videos are in array postarr
            posts.map((post)=>(
              <React.Fragment key={post.postId}>
                <div className='videos'>
                  <Video source={post.pUrl} id={post.pId}/>
                  {/* fa me =>img aur name  */}
                  <div className='fa' style={{display:'flex'}}>
                    {/* uProfile aur UName is in posts db ke ander */}
                    <Avatar src={post.uProfile}></Avatar>
                    <h4 onClick={() => { history.push("/user")}} >{post.uName}</h4>
                    {/* <User postData={post} onClick={() => { history.push("/user")}} className={classes.user}></User> */}
                    <Following userData={userData} postData={post} ></Following>
                  <ChatBubbleIcon onClick={() => handleClickOpen(post.pId)} className={`${classes.ci} icon-styling`} />
                  <Likes userData={userData} postData={post}/> 
                  </div>
                  {/* video ka parent is vedio-container , iska next sibling nikal lo */}
                      <Dialog maxWidth="md" onClose={handleClose} aria-labelledby="customized-dialog-title" open={openId === post.pId}>
                        <MuiDialogContent>
                          <div className='dcontainer'> 
                          {/* dcontainer me 2 part ek video part eek info part */}
                            <div className='video-part'>
                              <video  autoPlay={true} className='video-styles2' controls id={post.id} muted="muted" type="video/mp4" >
                                <source src={post.pUrl} type="video/webm" />
                              </video>
                            </div>
                            <div className='info-part' >
                              <Card>
                                <CardHeader
                                  avatar={
                                    <Avatar  src={post?.uProfile}  aria-label="recipe" className={classes.avatar}>
                                    </Avatar>
                                  }  
                                  action={
                                    <IconButton aria-label="settings">
                                   
                                      <MoreVertIcon />
                                    </IconButton>
                                    
                                  }
                                  title={post?.uName}
                                  
                                />
                                 <hr style={{ border: "none", height: "1px", color: "#dfe6e9", backgroundColor: "#dfe6e9" }} />
                                <CardContent className={classes.seeComments}>
                                  
                                <Comments userData={userData} postData={post} />
                                </CardContent>
                                
                              </Card>
                              <div className='extra'>
                              <div className='likes'>
                                <Typography className={classes.typo} variant='body2'>Liked By {post.likes.length == 0 ? 'nobody' : post.likes.length}</Typography>
                                </div>
                                <AddComment  userData={userData} postData={post}/> 
                                </div>
                            </div>
                          </div>
                        </MuiDialogContent>
                      </Dialog>
                      
                </div>
                <div className='place'></div>
              </React.Fragment>
            ))
          }

        </div>
        }
        </>
    
    )
}

export default Posts
