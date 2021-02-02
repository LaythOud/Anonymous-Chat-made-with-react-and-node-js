import React from 'react';

export default function Home(props) {
  
  const handleID = ()=>{
      props.socket.send(JSON.stringify({
        type:'Genrate-ID' ,
        data: props.ID
      }))
  }

  const handleInitRoom =(e , value)=>{
       e.preventDefault()
       if(value === "Message"){
          props.socket.send(JSON.stringify({
          type:'Create-Room-Chat',
          data:[
            props.ID
          ]}))
      }else if(value === "Call"){
        props.socket.send(JSON.stringify({
          type:'Create-Room-Call',
          data:[
            props.ID,props.peerID
          ]}))
      }else{
        props.socket.send(JSON.stringify({
          type:'User-Info'
        }))
      }
  }

  const handleGuest = ()=>{
    const roomID = document.getElementById('RoomID').value
    props.socket.send(JSON.stringify({
      type:'join-room',
      data:[roomID , props.ID]
    }))
  }

  return (
    <div className="Home">
      <div className="wrapper fadeInDown">
       <div id="formContent">
       
        <h2 className="active">   Welcome Friend ,to Anonymous Chat   </h2>
        
        <div className="fadeIn first">
          <i className="fa fa-user-secret icon"></i>
        </div>

          <h4 className="fadeIn second" >ID: {props.ID == null || props.ID === 'undefined'? "You Dont Have Rigth Now":props.ID}  </h4>
          <input type="submit" onClick={handleID} className="fadeIn third" value="Genrate ID"/>
          <input type="text" id="RoomID" className="fadeIn fourth" placeholder="Enter Room ID"/>
          <input type="submit" onClick={handleGuest}  className="fadeIn fourth" value="Join Room"/>
       
        <div id="formFooter">
          <a href="/"  onClick={e => handleInitRoom(e ,"Call")} className="underlineHover"><i className="fa fa-phone icon"></i></a>
          <a href="/" onClick={e => handleInitRoom(e ,"Message")} className="underlineHover"><i className="fa fa-comments-o icon"></i></a>
          <a href="/" onClick={e => handleInitRoom(e ,"Info")} className="underlineHover"><i className="fa fa-info icon"></i></a>
        </div>
      </div>
    </div>
   </div>
  );
}
