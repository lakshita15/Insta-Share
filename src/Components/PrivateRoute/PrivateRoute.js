import React, {useContext } from 'react'
import {Route , Redirect } from "react-router-dom"
//import context 
import {AuthContext} from '../../Context/AuthProvider'
//non authenticated user aagya to login pe bhejdo
//agr authenticated hai to feed show kro
//By using currentuser we could find whether a user is signed in or not 
//props passs exact ,path ,  component
//ab in props ko tod lia destructure krke {component} aur spread operator ka use krke bakio ko ek object me catch krlia 
function PrivateRoute({component:Component , ...rest}) {
    // console.log('rest=>'+rest);
    const {CurrentUser} = useContext(AuthContext)
    // console.log("i'm current user" + currentUser);

    return (
      
       /* render props a method from react router dom */
       /* ya to props nbhejo render me ya path deke component */
       /*   render ek cb fnc , props leta hai like location history map koi extra prop pass krana to usko alag se attatch kra dete the*/
       <Route {...rest} render={props=>{
        //    ek comp bhjna h jo vha login agr ye user curr user hai to isko component yani ffed ka access dedo vrna Redirect 
        //agr current user hai to component vale me jo component hai uspee ke jao vrna login pe return 
     return CurrentUser?<Component {...props} />:<Redirect  to ='/login'/>


       }}></Route>

        
    )
}

export default PrivateRoute
