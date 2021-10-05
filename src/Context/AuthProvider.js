import React , {useEffect,useContext, useState}from 'react'
import {auth} from "../firebase"

export const AuthContext = React.createContext(); 

function AuthProvider({children}) {
    //loading state 
    const [loading, setloading] = useState(true)
    //user state
    const [CurrentUser, setCurrentUser] = useState()

    //signup function
    //all functions return krre hai ye ek promise
    function signup(email , password){
        return auth.createUserWithEmailAndPassword(email,password);

    }
    function login(email , password){
        return auth.signInWithEmailAndPassword(email,password)
    }
    function logout(){
        return auth.signOut();
    }          
    
    const value ={
        CurrentUser,
        login,
        signup,
        logout
    }
    console.log(CurrentUser);
    useEffect(()=>{
        const unsubscribe  = auth.onAuthStateChanged(user=>{
            setCurrentUser(user);
            console.log(user);
            setloading(false);
        })
        return ()=>{
            unsubscribe();
        }
    },[])

    return (
       <AuthContext.Provider value={value}>
           {/* loading ni ho aur children present ho tbhi dikhaye */}
           {/* children tbhi render ho jab loading false */}
           {!loading&&children}
           </AuthContext.Provider>
    )
}

export default AuthProvider
