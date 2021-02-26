import React from 'react';

export default function Info(props) {

    const handleX = ()=>{
        props.socket.send(JSON.stringify({
            type:'get-out'
        }))
    }

    return(
        <div className="Info">
            <button onClick={handleX} className="chat-exit fadeIn first">X</button>
            <div className="wrapper fadeInDown">     
                <div id="formContent"  >
                    <h3 className="active fadeIn second" >Welcome to Anonymous Chat</h3>
                    <p className="fadeIn third">
                        <b>How to use:</b>   <br/>
                        1. Choose the type of chat by clicking:<br/>
                            <i className="fa fa-video-camera icon"></i> for video chatting<br/>
                            <i className="fa fa-comments-o icon"></i>for texting<br/>
                        2. Now, an identifier like <b>"c3e54330-95da-48bd-98ba-a34ed9cbb197"</b> will appear at the top of the page, copy it and send it to your friend. <br/><br/>
                        3. Finally, your friend should paste that same identifier in the <b>Enter Room ID</b> box at home page, then click <b>JOIN ROOM</b> button.<br/><br/>
                        Enjoy ^_^
                    </p>
                </div>
            </div>
        </div>
    )
}