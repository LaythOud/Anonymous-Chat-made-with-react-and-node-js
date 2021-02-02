import React, { useEffect }  from 'react'


export default function Message(props) {

    let msg = props.chatLog.split(',')
    let isMe 
 
    const none = {
        textAlign:'initial'
    }

   
    const handleX = ()=>{
        props.socket.send(JSON.stringify({
            type:'get-out'
        }))
    }

    const sendMessage = () =>{
        const text = document.getElementById('message').value
        if(text === "" || text.search(',') !== -1) return 
        props.socket.send(JSON.stringify({
            type:'message-send',
            data:{message:text ,roomID:props.roomID,ID:props.ID}
        }))
        document.getElementById('message').value = ''
    }

    props.socket.addEventListener('message' , event =>{
        const messageObj = JSON.parse(event.data)
        switch (messageObj.type) {
            case 'message-recieve':
                props.setChatLog(props.chatLog  + messageObj.data.sender + ',' + messageObj.data.message + ',')
                break
        }
    })

    useEffect(()=>{
        msg = props.chatLog.split(',')
    } , [props.chatLog])

    document.addEventListener('keydown' , (e)=>{
        if(e.key === "Enter")
            sendMessage()
    })

    return(
        <div className="Message">
            <button onClick={handleX} className="chat-exit fadeIn first">X</button>
            <div className="wrapper fadeInDown">     
                <div id="formContent"  >
                <h3 id="roomID" className="active fadeIn second" >{props.roomID}</h3>    
                    <div className="fadeIn second Chat"> 
                    {
                        msg.map((m , index)=>{
                            if(index%2 === 0){
                                isMe = props.ID === m?1:0
                            }else{
                                if(isMe)return(
                                <div key={index} style={none} className="outside">
                                    <i className="fa fa-user"></i>
                                    <div className="inside">
                                    {m}
                                    </div>
                                </div>)
                                else return(
                                <div key={index} style={none} className="outside">
                                    <i className="fa fa-user"></i>
                                    <div className="inside-me">
                                        {m}
                                    </div>
                                </div>)
                            } 
                        })
                    }            
                    </div>
                    <div className="fadeIn third send-box">
                        <input id="message" type="text" className="send-text" placeholder="Enter Message"/>
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    )
}