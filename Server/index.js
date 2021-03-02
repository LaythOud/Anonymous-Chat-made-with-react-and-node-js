/*
    sorry for one page code.
    in future update I will make it clean code.
*/

    /* module */
////////////////////////////////////////////////////////////////////////

const http = require('http')
const express = require('express')
const ws = require('ws')
const uuid = require('uuid')

    /*varaible */
////////////////////////////////////////////////////////////////////////

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 5000
const wss = new ws.Server({server})
const reg = new RegExp(/([\d|a-f]+-){4}[\d|a-f]+/)
let clients = []
let rooms = []

    /* Middleware */
////////////////////////////////////////////////////////////////////////

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
//     next();
// });


    /*Function*/
////////////////////////////////////////////////////////////////////////

const addNewClient = (ID , ws)=>{
    let isValid = 1
    let oldid = ID
    clients.map(client =>{
      if( client.ws === ws || client.ID === ID ){
        isValid = 0
        oldid = client.ID
      }
    })
    
    if(isValid){ 
        clients.push({ws:ws , ID:oldid})
        console.log("New Client Added !")
    }    
    return oldid
}

const addNewRoom = (roomID , createrID , Type , peerID)=>{
     let isValid = 1
     rooms.map(room => {
       if(room.roomID === roomID) 
            isValid = 0
     })
    if(isValid){
        console.log('Create new room: ' , {roomID:roomID , createrID: createrID , guestID: '' , peerID:peerID } )
        rooms.push({roomID:roomID , createrID: createrID , guestID: '' , Type:Type , peerID:peerID })
    }
}

const addClientToRoom = (roomID , ID )=>{
    let isValid = 0
    rooms.map(room =>{
        if(room.roomID === roomID ){
            if(room.guestID === '' && room.createrID !== ID){
                room.guestID = ID
                isValid = 1
                console.log("Client Added To The Room Successfly" , ID)
            }
            if(room.guestID !== ID && room.createrID === ''){
                room.createrID = ID
                isValid = 1
                console.log("Client Added To The Room Successfly" , ID)
            }
        }
    })
    
    return isValid
}
 
const getRoomType = (roomID)=>{
    const room  = rooms.filter(room =>{
                if(room.roomID === roomID )
                   return room
                })
               
    if(room[0] !== undefined && room.length)return room[0].Type
    return ''
}

const getPeerID = (roomID) =>{
    const ID =  rooms.filter(room=>{
                if(room.roomID === roomID)
                    return room
                })
    return ID[0].peerID
}

const isRoom = (roomID) =>{
    let valid = 0
    rooms.map(room =>{
        if(room.roomID === roomID)
            valid = 1
    })
    return valid
}


const getClients  = ()=>{
    return [clients.map(client => (client.ID))]
}

const getClient = (ws)=>{
    const client =  clients.filter(client =>{
            if(client.ws === ws)
                 return client
            })
    if(client[0]) return client[0].ID
}

const getFriendWS = (ws) =>{
    const ID = getClient(ws)
    let frID
    if(ID){
        const room = rooms.filter(room =>{
            if(room.createrID === ID || room.guestID === ID)
                return room
        })[0]
       
        if(room){
            if(room.createrID === ID )
                frID = room.guestID 
            else if(room.guestID === ID)
                frID = room.createrID 
         
           return clients.filter(client => {
                if(client.ID === frID)
                return client
            })[0]
        }
    }
}

const getRooms  = ()=>{
    return rooms
}

const clearClient = (clientOut)=>{
    console.log("Client clear")
    clients = clients.filter(client => { if(client.ws !== clientOut) return clients })
}

const getOutRoom = (clientOut)=>{
    console.log("User Out")
    const ID = getClient(clientOut)
    if(ID){
        rooms  = rooms.filter(room => {
            if(room.createrID !== "" && room.guestID !== ""){
                if(room.createrID === ID){
                    room.createrID = ""  
                    return room
                }else if(room.guestID === ID ){
                    room.guestID = "" 
                    return room
                }
            }else{
                if(room.createrID !== ID && room.guestID !== ID )
                    return room
                else
                    console.log("Room Clear")
            }
          })
    }
}

    /* api */
////////////////////////////////////////////////////////////////////////

app.get('/clients' , (req , res) =>{
    res.json(getClients())
})


app.get('/rooms' , (req , res) =>{
    res.json(getRooms())
})

    /* Socket */
////////////////////////////////////////////////////////////////////////

wss.on('connection' , ws=>{
    ws.on('message' , message =>{
        try{
            let messageObj = JSON.parse(message)
            switch (messageObj.type) {
                ///////////////////////////////////////////////////////////////
                case 'Genrate-ID':
                    if(!reg.test(messageObj.data)){//Client ID Valid
                        const newClientId = uuid.v4()
                        let check =  addNewClient(newClientId , ws)
                        ws.send(JSON.stringify({type:'Add-Success' , data:check}))
                        ws.send(JSON.stringify({type:'Set-Display' , data:"Info"}))
                    }else{
                        ws.send(JSON.stringify({type:'Double-ID-Valid'}))
                    }
                    break
                /////////////////////////////////////////////////////////////
                case 'Refresh-Client':
                    if(reg.test(messageObj.data[0])){//Client ID Valid
                        console.log('Refresh Client' , messageObj.data[0])
                        let check = addNewClient(messageObj.data[0] , ws )  
                        if(reg.test(messageObj.data[2])){
                            if(!isRoom(messageObj.data[2])){
                                addNewRoom(messageObj.data[2] , messageObj.data[0] ,messageObj.data[1] ,messageObj.data[3])
                            }else{
                                addClientToRoom(messageObj.data[2] , messageObj.data[0])
                            }
                            ws.send(JSON.stringify({type:'Set-RoomID' , data:messageObj.data[2]}))
                            ws.send(JSON.stringify({type:'Set-PeerID' , data:messageObj.data[3]}))
                        }
                        ws.send(JSON.stringify({type:'Add-Success' , data:check}))
                        ws.send(JSON.stringify({type:'Set-Display' , data:messageObj.data[1]}))
                    }
                    break
                case 'Refresh-Call':
                        const fws = getFriendWS(ws)
                        if(fws)fws.ws.send(JSON.stringify({type:'user-connected' , data:messageObj.data}))
                        break
                 ///////////////////////////////////////////////////////////////
                case 'Create-Room-Call':
                    if(reg.test(messageObj.data[0])){ // Creater ID Vaild
                        ws.send(JSON.stringify({type:'Set-Display' , data:"Call"}))
                        const newRoomID = uuid.v4();
                        addNewRoom(newRoomID , messageObj.data[0]  , "Call", messageObj.data[1])
                        ws.send(JSON.stringify({type:'Set-RoomID' , data:newRoomID})) 
                    }else{
                        ws.send(JSON.stringify({type:'ID-Not-Valid'}))
                    }
                    break
                ///////////////////////////////////////////////////////////////    
                case 'Create-Room-Chat':
                    if(reg.test(messageObj.data[0])){ // Creater ID Vaild
                        ws.send(JSON.stringify({type:'Set-Display' , data:"Message"}))
                        const newRoomID = uuid.v4();
                        addNewRoom(newRoomID , messageObj.data[0],"Message" , "none" )
                        ws.send(JSON.stringify({type:'Set-RoomID' , data: newRoomID}))     
                       }else{
                       ws.send(JSON.stringify({type:'ID-Not-Valid'}))
                    }
                    break
                ///////////////////////////////////////////////////////////////
                case 'User-Info':
                    ws.send(JSON.stringify({type:'Set-Display' , data:"Info"}))
                    break
                ///////////////////////////////////////////////////////////////
                case 'join-room':
                    if(reg.test(messageObj.data[0])){ // RoomID Valid
                        if(reg.test(messageObj.data[1])){ // Guest ID Vaild
                            const type = getRoomType(messageObj.data[0])
                            if(type !== ''){
                                if(addClientToRoom(messageObj.data[0] , messageObj.data[1])){// Room Empty Valid
                                    ws.send(JSON.stringify({type:'Set-Display' , data:type}))
                                    ws.send(JSON.stringify({type:'Set-RoomID' , data: messageObj.data[0]}))
                                    if(type === "Call"){  
                                        const ID = getPeerID(messageObj.data[0])
                                        if(ID)ws.send(JSON.stringify({type:'user-connected' , data:ID}))
                                    }
                                }   
                                else
                                    ws.send(JSON.stringify({type:'Room-NotEmpty-Valid'}))
                            }else{
                                ws.send(JSON.stringify({type:'RoomID-Not-Valid'}))
                            }
                        }else{
                            ws.send(JSON.stringify({type:'ID-Not-Valid'}))
                        }
                    }else{
                        ws.send(JSON.stringify({type:'RoomID-Not-Valid'}))
                    }
                    break
                 ///////////////////////////////////////////////////////////////
                case 'alert':
                    ws.send(JSON.stringify({type:messageObj.data}))
                    break
                ///////////////////////////////////////////////////////////////
                case 'message-send':
                // TODO: send to all user , emit resive
                if(reg.test(messageObj.data.roomID)){
                    const room = rooms.filter((room) =>{
                            if(room.roomID === messageObj.data.roomID)
                                return room
                    })

                    if(room[0] !== undefined && room.length ){
                        const client = clients.filter((clnt)=>{
                                if(clnt.ID === room[0].createrID || clnt.ID === room[0].guestID)
                                        return clnt
                        })
                        if(client !== undefined && room.length ){
                            client.map(clnt=>{
                                clnt.ws.send(JSON.stringify({
                                    type:'message-recieve' ,
                                    data:{message:messageObj.data.message , sender:messageObj.data.ID}
                                }))
                            })
                            console.log(messageObj.data.ID + " Send Message : " + messageObj.data.message )
                        }
                    }
                }
                break
                ///////////////////////////////////////////////////////////////////////////////
                case 'get-out':
                    const frws = getFriendWS(ws)
                    if(frws) frws.ws.send(JSON.stringify({type:'user-disconnected'}))
                    ws.send(JSON.stringify({type:'Set-Display' , data:"Home"}))
                    ws.send(JSON.stringify({type:'Set-RoomID' , data: ""}))
                    ws.send(JSON.stringify({type:'Set-ChatLog' , data: ""}))
                    ws.send(JSON.stringify({type:'refresh' }))
                    getOutRoom(ws)
                break
            }
        }
        catch(error){
             console.log(error)
         }
     })

    ws.on('close' , async ()=>{
        await getOutRoom(ws)
        clearClient(ws)
    })
})

server.listen(PORT , () => console.log("you are listen on port: http://localhost:" + PORT));