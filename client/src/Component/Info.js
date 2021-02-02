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
                    <h3 className="active fadeIn second" >Hello and thanks for using our app</h3>
                    <p className="fadeIn third">
                        <b>How to use?</b>   <br/>
                        1.click on icon in home page for start chating:<br/>
                            i.<i className="fa fa-phone icon"></i> for phone call<br/>
                            ii.<i className="fa fa-comments-o icon"></i>for message chat<br/>
                        2.after step one you will see <b>something like this</b> on top of the page "c3e54330-95da-48bd-98ba-a34ed9cbb197" copy it and send it to your friend<br/><br/>
                        3.one last thing, let your friend copy  "c3e54330-95da-48bd-98ba-a34ed9cbb197" and paste it in home page in <b>enter room id box</b> then click join and ready to go<br/><br/>
                        easy right ^_^
                    </p>
                </div>
            </div>
        </div>
    )
}