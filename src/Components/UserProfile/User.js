
import React, { useState, useEffect , useContext} from "react";
import { database, storage } from "../../firebase";
import { makeStyles } from "@material-ui/core/styles";
import { AuthContext } from "../../Context/AuthProvider";
import Video from "../Videos/Video";

const useStyles = makeStyles((theme) => ({
  chatBubble: {
    color: "#3f3f41",
    cursor: "pointer",
    fontSize: "32px",
  },
  typo: {
    marginLeft: "2%",
    marginTop: "2%",
  },
  postDialogBox: {
    background: "rgba(222, 215, 240, 0.486)",
  },
  dialogHeader: {
    height: "8vh",
  },
  dialogComments: {
    height: "55vh",
    fontFamily: "'Nunito', sans-serif",
  },
}));

function Profile() {
  const classes = useStyles();
  const [openId, setOpenId] = useState(null);
  const [userData, setuserData] = useState(null)
  const [profPosts, setPosts] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const {CurrentUser}=useContext(AuthContext);

    useEffect(() => {
        console.log(CurrentUser)
        const unsub = database.users.doc(CurrentUser.uid)
        .onSnapshot((doc)=>{
        setuserData(doc.data());
        })    
    }, [CurrentUser])
    const handleClickOpen = (id) => {
      setOpenId(id);
    };
    const handleClose = () => {
      setOpenId(null);
    };
      const callback = entries=>{
        entries.forEach(element => {
            console.log(element);
            let el = element.target.childNodes[0];
            el.play().then(()=>{
                //if this video is not in viewport then pause it
                if(!el.paused && !element.isIntersecting)
                {
                    el.pause();                
                }
            })

        });
    }
    const observer = new IntersectionObserver(callback,{ threshold:0.85 });
    
    useEffect(()=>{
      let elements = document.querySelectorAll('.videos');
      elements.forEach(el=>{
        observer.observe(el);
      })
      //kisine ek video dali , snapshot call , postarr again bna , state change post ki , useeffcet rely on post ,new post render hua aur  new post ui pe aa gai bt listener to attatch ni hua , to listener attatch krna pdega , new use effect chlegha vo sab elements ko dobara se nikalega aur dobara se listener attach , bt already purani pe lister tha to dobara attach krne ka mtlb ni bnta hai to cleanup facility se humne observer pe lage listener ko disconnect krdia // useeffect me jo ki hai usko remove krdo 
      return ()=>{    
        observer.disconnect();
      }
    },[profPosts])
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
          console.log(postarr);
          console.log(CurrentUser.uid);
          let arrPost = postarr.filter((elem)=>{
              console.log("elem",elem);
            if(elem.userId === CurrentUser.uid){
                return elem;
            }
          });
          setPosts(arrPost);
        })
    return unsub; //cleanup 

},[])
  return (
    <>
    {
                userData && userData.profileUrl && userData.userName &&(

                <>
                <img class = "avatar" src={userData.profileUrl}></img>
                
            <h4>{userData.userName}</h4>
            <div>{userData.following.length}</div>
            <div>{userData.followers.length}</div>
            </>
                )
               }
      {profPosts == null ? (
        <div className="feedLoading">

        </div>
      ) : (
        <div className="profilePostContainer">
          {profPosts.map((post, index) => (
            <React.Fragment key={post.postId}>
              
              <div className='videos'>
                    <Video source={post.pUrl} id={post.pId}  />
                 
                    </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  );
}

export default Profile;
