import React, { useState }  from 'react';
import PeerJs from './PeerJs'

export default function Call(props) {

   const handleX = ()=>{
        props.socket.send(JSON.stringify({
            type:'get-out'
        }))
     }


    return( 
        <div className="Call">
            <button onClick={handleX} className="chat-exit fadeIn first">X</button>
            <div className="wrapper fadeInDown">
                <div id="formContent">
                    <h3 id="peerID" className="active fadeIn first" >{props.roomID}</h3>
                    <div className="fadeIn second" id="video-grid">
                        <video id="me"></video>
                        <video id="friend"></video>
                        <PeerJs  myPeer={props.myPeer} roomID={props.roomID} socket={props.socket} ID={props.ID} />
                   </div>
                </div>
            </div>
        </div>
    )
}