import React,{useState} from 'react'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
 import Alert from '@material-ui/lab/Alert';
 import {v4 as uuidv4} from 'uuid';
 import LinearProgress from '@material-ui/core/LinearProgress';
 import {storage,database} from '../../firebase'


//kisi bhi post ke lie  pId,pUrl => firestore me video upload kri hai ab usko dikhana pdega to isse aayegi,uName =>jisne upload kia hai uska naam,uProfile,userId,createdAt
//upload file ke btn pe jake user file upload post ka data post naam ki collection me hoga , abhi tk ek collection use kia hai users , 

const useStyles = makeStyles((theme) => ({
    
}));

function UploadFile(props) {

    const onChange=(e)=>{

        //ye quesmark is reaact ka syntax => agr "e" null/undefined to ye aage ni jayega 
        const file = e?.target?.files[0]; //files array dega usme se 0th index ki file nikal li
        console.log(file);
        //agr file null aagai => no files is selected by us =>upload nhi chlao aage =>error set => settimeout se error empty aftr 2 sec
        if(!file){
            setError('Please Select A File');
            setTimeout(()=>{setError('')},2000)
            return;
        }
        //limit of file set krre hai agr 100 se bda to  error set
        if(file.size/(1024*1024)>100){
            setError("Selected File Is Too Big")
            setTimeout(()=>{setError(null)}, 2000)
            return;
        }
        //video h ya ni file.type)==-1 =>video ni h agr ka sayntax
        if(type.indexOf(file.type)==-1)
        {
            setError('Please select a video file');
            setTimeout(()=>{setError(null)},2000)
            return;
        }

        const id = uuidv4();
        const uploadTask = storage.ref(`/posts/${props.userData.userId}/${file.name}`).put(file)
        // console.log(uploadTask);
        uploadTask.on('state_changed',fn1,fn2,fn3);
        function fn1(snapshot){
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');         
        }
        function fn2(error){
            setError(error);
            setTimeout(()=>{
                setError(null)
            },2000);
            setLoading(false)
        }
        async function fn3(){
          setLoading(true);
          uploadTask.snapshot.ref.getDownloadURL().then(url=>{
              let obj  ={
                  comments:[],
                  likes:[],
                  pId:id,
                  pUrl:url,
                  uName:props?.userData?.userName,
                  uProfile:props?.userData?.profileUrl,
                  userId:props?.userData?.userId,
                  createdAt:database.getCurrentTime()
              }
              console.log(obj);
              console.log(props.userData);
              database.posts.add(obj).then(async docRef=>{
                  console.log(docRef);
                  let res = await database.users.doc(props.userData.userId).update({
                      //spread optr isiliye lgaya kuki agr nhi lgate to array update hota aur purani vali remove ab ek copy bnke add honge posts 
                      //[a,b]=>a pe set kra dia b

                      postId:[...props.userData.postId,docRef.id]
                  }) // Updates fields in the document referred to by this DocumentReference. The update will fail if applied to a document that does not exist.
              }).then(()=>{
                  setLoading(false)
              })
              .catch(error=>{ 
     setError(error);
            setTimeout(()=>{
                setError(null)
            },2000);
            setLoading(false)
              })
          })
        }
    }
    //error,loading,file ki nhi 
    //in signup , photo submit ke lie humne handle file submit bnaya tha jab sab feild done tb ye submit hota tha to state needed thi bt here click pe event se he file aa jayegi
    const classes = useStyles();
    const [loading, setLoading] = useState(false)
    const[error , setError] = useState(null) 
    const type =['video/mp4','video/webm','video/ogg']
    return (
        <>
        { 
            error!=null? <Alert severity="error">{error}</Alert>:<>
            <input 
            color='primary'
            type='file'
            onChange={onChange}
            id='icon-button-file'
            style={{display:'none'}}
            />
            <label htmlFor='icon-button-file'>
            <Button disabled={loading} variant="outlined" component='span' className={classes.button} 
            size='medium' color="secondary">
                UPLOAD VIDEO 
            </Button>

            </label>
            {loading?<LinearProgress color='secondary' style={{marginTop:'6%'}} />:<></>}
            </>

        }
        </>
    )
}

export default UploadFile
