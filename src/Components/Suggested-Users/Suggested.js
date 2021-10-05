import React, {useContext,useState, useEffect} from 'react'
import { database } from '../../firebase'
import { useHistory } from 'react-router';
import { AuthContext } from '../../Context/AuthProvider';
function Suggested({userData=null}) {

let ans = database.users.get();

    return (
         <>
           <h4>suggested</h4>
               {
                   //show users that are not in current user ki following //users mna lo saara //filter out users that are not in my following
               }
            
        </>
    )
}

export default Suggested
