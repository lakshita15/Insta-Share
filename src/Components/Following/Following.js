import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../Context/AuthProvider";
import { database } from "../../firebase";

function Following({ userData = null, postData = null }) {
  console.log("postData" , postData);
  const { CurrentUser } = useContext(AuthContext);
  // const [curruserData, setuserData] = useState(null)
  const [isOn, settoggleIsOn] = useState(false);
  const[btntxt , setbtntxt] = useState("follow")
  const toggleIsOn = (e) => {
      e.preventDefault()
    if (isOn == true && btntxt=="following") {
      settoggleIsOn(false);
      setbtntxt("Follow")
      let uarr = userData.following.filter((elem) => {
        return elem != postData.userId;
      });
      database.users.doc(CurrentUser.uid).update({
        following: uarr,
      });
      let uarr2 = userData.followers.filter((elem) => {
        return elem !=CurrentUser.uid;
      });
      database.users.doc(postData.userId).update({
        followers: uarr2,
      });
    } else {
      settoggleIsOn(true);
      setbtntxt("following")
      // console.log(postData.userId); jiski post hai uski details
      let res = database.users.doc(CurrentUser.uid).update({
        //spread optr isiliye lgaya kuki agr nhi lgate to array update hota aur purani vali remove ab ek copy bnke add honge posts
        //[a,b]=>a pe set kra dia b
        following: [...userData.following, postData.userId],
      });
      let res2= database.users.doc(postData.userId).update({
          followers:[...userData.followers, CurrentUser.uid]
      })
    }
  };
  // console.log("userdata",userData);
  // console.log(userData.following) //jiski post hai uski id

  useEffect(() => {

    let check = userData.following.includes(postData?.userId)?"following":"follow";
    setbtntxt(check)
    
   } ) 
  return (
    <>
      <button onClick={toggleIsOn}>{btntxt}</button>
    </>
  );
}

export default Following;
