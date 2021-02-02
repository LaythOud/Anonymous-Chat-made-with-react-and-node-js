import './Style/App.css';
import Home from './Component/Home';
import React, { useState , useEffect } from 'react';
import {useSocket} from './Provider/SocketProvider'
import IDStorage from "./Storage/IDStorage";
import SessionStorage from "./Storage/SessionStorage"
import Call from './Component/Call'
import Info from './Component/Info'
import Alert from './Component/Alert'
import Message from './Component/Message'
import {usePeer} from './Provider/PeerProvider'

export default function App() {
 
  const socket = useSocket()
  const myPeer = usePeer()
  
  const [display , setDisplay ] = SessionStorage('display','Home')
  const [roomID , setRoomID ] = SessionStorage('roomID','')
  const [peerID , setPeerID ] = SessionStorage('PeerID','')
  const [chatLog , setChatLog]  = SessionStorage('chatLog' , "")
  const [ID , setID] = IDStorage('ID' ,  'undefined')
  const [message , setMessage] = useState("")

  useEffect(() => {
    window.sessionStorage.setItem("Anonymous-Chat-chatLog" , (chatLog))
  } , [chatLog])

  useEffect(() => {
    window.sessionStorage.setItem("Anonymous-Chat-PeerID" , (peerID))
  } , [peerID])

  myPeer.on('open' , id=>{
		setPeerID(id)
	})

/* ///////////////////////////////////////////////////////////////// */

  socket.addEventListener('message' , event =>{
    const messageObj = JSON.parse(event.data)
    switch (messageObj.type) {
      case 'Add-Success':
        setID(messageObj.data)
        break
      case 'Set-Display':
        setDisplay(messageObj.data)
        break
      case 'Set-RoomID':
        setRoomID(messageObj.data)
        break
      case 'Set-ChatLog':
        setChatLog(messageObj.data)
        break
      case 'Set-PeerID':
        setPeerID(messageObj.data)
        break
      /////////////////////////////////////////////////////////
      case 'Double-ID-Valid':
        setMessage("You already have ID")
        break
      case 'ID-Not-Valid':
        setMessage("You must have ID befor get in a room")
        break
      case 'Room-NotEmpty-Valid':
        setMessage("Sorry, Room is Full")
        break
      case 'RoomID-Not-Valid':
        setMessage("Sorry, RoomID is Wrong")
        break
      case  'user-disconnected':
        setMessage("Friend Is Out")
        break
      case 'refresh':
        setTimeout(()=>{window.location.reload()} , 500)
        return
    }
  })

  socket.addEventListener('open' , event =>{
    socket.send(JSON.stringify({
        type:'Refresh-Client',
        data:[
          localStorage.getItem('Anonymous-Chat-ID') ,
          window.sessionStorage.getItem('Anonymous-Chat-display'),
          window.sessionStorage.getItem('Anonymous-Chat-roomID'),
          window.sessionStorage.getItem('Anonymous-Chat-peerID')
        ]
    }))
  })
  
/* ///////////////////////////////////////////////////////////////// */
  return (
    <div className="App">
      { message !== ""? <Alert message={message} setMessage={setMessage}/>:'' }
      { display === "Message"?
          <Message socket={socket} ID={ID} setDisplay={setDisplay} roomID={roomID} chatLog={chatLog} setChatLog={setChatLog}/>:
          display === "Call"?
           <Call myPeer={myPeer} setDisplay={setDisplay} ID={ID} socket={socket} roomID={roomID} />:
           display === "Info"?
            <Info socket={socket}/>:
            <Home socket={socket} peerID={peerID} ID={ID} setDisplay={setDisplay} /> 
     }
   </div>
  );
}
