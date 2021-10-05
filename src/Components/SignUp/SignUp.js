import React, {useState, useContext,useEffect} from 'react'
import {AuthContext} from '../../Context/AuthProvider';
import { storage ,database } from '../../firebase';
import { useHistory } from 'react-router-dom'

//Need:-
// 1. Email
// 2.password
// 3.Name
//4. error
//5. loading
//6. File Submit 

function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const[error,setError] = useState('');
    const [file, setFile] = useState(null)
    const[loading,setLoading] = useState(false);
    const {signup , CurrentUser}= useContext(AuthContext) 
    const history = useHistory();

    const handleSignup =async (e)=>{
        e.preventDefault();
        try{
        setLoading(true);
        let res = await signup(email,password);
        let uid = res.user.uid
        console.log(uid);
        //upload task
        //firebase ka listener bnta hai is listener pe bta dete hai ki hume basically dalna kya hai 
        //path btate hai ki storage ka ye vala ref hai jha pe upload hoga 
        //storage.ref me path (usersa ka folder bn jaye , jis user ka folder bnra uska ek unique folder bn jaye us me ek file bn jaye jiska data equal ho jo file put ke ander daali hai)
        const uploadtasklistener= storage.ref(`/users/${uid}/profileImage`).put(file); //img in storage
        
        //ye ek listener dega 
        //ispe event dalte hai on ka 
        // on Listens for events on this task.eg image upload hora hai to uske 3 case in these 3 ffunctions
        // Events have three callback functions :-
        //fn1:- progress track 
        //fn2:- error track
        //fn3:- complete success track
        // """state_changed """observer called anytime when state chnages
        // If only the event is passed, a function that can be used to register the callbacks is returned. Otherwise, the callbacks are passed after the event.
        // Callbacks can be passed either as three separate arguments or as the next, error, and complete properties of an object. Any of the three callbacks is optional, as long as at least one is specified. In addition, when you add your callbacks, you get a function back. You can call this function to unregister the associated callbacks.
        uploadtasklistener.on("state_changed" , fn1 , fn2 , fn3)
        
        function fn1(snapshot){
            //snapshot :- tells us about/ tracks the  the progress
            
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');      
        }
        function fn2(error){
            setError(error);
            setTimeout(()=>{
                setError('')
            },2000); //error jaane baad ddobara upload kr paye 
            setLoading(false)
        }
        //fn3 kind of like a promise=>make it async
        //ek promise return 
        //uska reesult is the download url
        //ref catched in uploadtasklistener ispe ek snapshot.ref.getDownloadURL() function aata hai ye ek promise me jo bhi humne file upload kri hai uska url laake de deta hai 
        async function fn3(){
            let downloadurl = await uploadtasklistener.snapshot.ref.getDownloadURL();
            console.log(downloadurl);
            //users collec  me doc add usme ye feilds set
            //collection me put krne ka kaaam
            database.users.doc(uid).set({
                email:email,
                userId:uid,
                userName:name,
                createdAt:database.getCurrentTime(),
                profileUrl:downloadurl,
                postId:[],
                followers:[],
                following:[],
                requests:[]

            })
        }
        setLoading(false)
        console.log('user signed up');
        history.push('/')
        }catch(err){
        setError(err)
        setTimeout(()=>setError(''),2000)
        setLoading(false)
    }

    }
   const handlefilesubmit=(e)=>{
       let file= e.target.files[0]
       console.log(file);
       if(file !=null){
        setFile(file)
       }
   }
   useEffect(() => {
       if(CurrentUser){
           history.push('/')
       }
      
   }, [])
    return (
        <div>
             <form onSubmit={handleSignup} >
                <div>
                    <label htmlFor=''>UserName</label>
                    <input type='text' value={name} onChange={(e)=>setName(e.target.value)}/>

                </div>
                <div>
                <label htmlFor=''>Email</label>
                    <input type='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                </div>
                <div>
                <label htmlFor=''>Password</label>
                    <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor='profile'>Profile image</label>
                    <input type='file' accept='image/*' onChange={
                        handlefilesubmit}></input>
                </div>
                <button type='submit' disabled={loading}>SignUp</button>
            </form>
        </div>
    )
}

export default SignUp

//friendid array //foloowers and following array
//profile pe click follow 
