
export default function PeerJs(props) {
	
	let myVideo = document.getElementById('me')

	// respone to your friend call
	props.myPeer.on('call' , call =>{
		if(navigator.mediaDevices){
			navigator.mediaDevices.getUserMedia({
				video:true,
				audio:true
			}).then(stream =>{
				
				addVideoStream(myVideo , stream , 0) 
				call.answer(stream)
				const video = document.getElementById('me')
				call.on('stream' , userVideoStream =>{
					addVideoStream(video , userVideoStream , 1)
				})
				call.on('close' ,()=>{
					video.remove()
				})
			}).catch(err=>{
				console.log("Error:" , err)
			})
		}
	})

	// props.myPeer.on('disconnected',  ()=> {
	// 	if(!props.myPeer.destroyed){
	// 		console.log('Connection lost. Please reconnect');
	// 		props.myPeer.reconnect(); 
	// 		// props.socket.send(JSON.stringify({
	// 		// 	type:'Refresh-Call',
	// 		// 	data:props.roomID
	// 		// }))
	// 	}
	// });


	// here your friend will call you when he connect to the room
	function connectToNewUser(userId) {
		if(navigator.mediaDevices){
			navigator.mediaDevices.getUserMedia({
				video:true,
				audio:true
			}).then(stream =>{

				addVideoStream(myVideo , stream , 0)
				const call = props.myPeer.call(userId ,stream)
				const video = document.getElementById('friend')
				call.on('stream' , userVideoStream =>{
					addVideoStream(video , userVideoStream , 1) 
				})
				call.on('close' ,()=>{
					video.remove()
				})
				
			}).catch(err=>{
				console.log("Error:" , err)
			})
		}
	}

	function addVideoStream(video , stream , check) {
		if(!check){
			video = document.getElementById('me')
			video.muted  = true
		}
		else video = document.getElementById('friend')

		video.srcObject = stream
		video.addEventListener('loadedmetadata',() =>{
			video.play();
		})
	}

	props.socket.addEventListener('message' , event =>{
		const messageObj = JSON.parse(event.data)
		switch (messageObj.type) {
			case 'user-connected':
				connectToNewUser(messageObj.data)
				break
		}
	})


	return ('')
}