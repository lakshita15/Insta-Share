import React from 'react'
import './Video.css'
import ReactDOM from 'react-dom';

const handleMute=(e)=>{
    e.preventDefault(); //prevent pause play default signs of video 
    e.target.muted = !e.target.muted;

}       

const handleautoscroll=(e)=>{
let next = ReactDOM.findDOMNode(e.target).parentNode.nextSibling;
if(next){
    next.scrollIntoView({behaviour:'smooth'})
    e.target.muted = true;
}
}
function Video(props) {
    return (
       <>
       <video onEnded={handleautoscroll} src={props.source} className='bideo-styles' onClick={handleMute} muted='muted' type ="video/mp4"></video>
       </>
    )
}

export default Video
