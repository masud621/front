import logo from './logo.svg';
import './App.css';
import {useEffect, useState, useRef} from 'react'
import io from 'socket.io-client'
import Peer from 'peerjs';
let socket;
function App() {
  const myVideo = useRef()
  const videoContainer = useRef()
  
  const [userId, setUserId] = useState('')


  useEffect(()=>{
    socket = io('https://git.heroku.com/videoback.git')
    socket.on('userId', (id)=>{
      setUserId(id)
    })
    
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
      const myPeer = new Peer()
      // Collected id from peer
      myPeer.on('open', peerId=>{
        socket.emit('join-room', 'myroom', peerId)
      })


      myVideo.current.srcObject= stream
      const userVideo = document.createElement('video')

      // Send media stream to Peer
				myPeer.on('call', (call)=>{
          call.answer(stream)
          call.on('stream', (userVideoStream)=>{
            addVideoStream(userVideo, userVideoStream)
          })
        })
        
       socket.on('user-connected', (peerId)=>{
         // Get data by PeerId
        const call = myPeer.call(peerId, stream)
        call.on('stream', userVideoStream=>{
          console.log(userVideoStream, 'uservideostream');
          addVideoStream(userVideo, userVideoStream)
        })
       })

		})

    
    
  }, [])

// Add user video stream to <video></video>
  const addVideoStream = (video, stream)=>{
    video.srcObject = stream
      video.addEventListener('loadedmetadata', () => {
        video.play()
      })
      videoContainer.current.appendChild(video)

  }

  
  return (
    <div >
      <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />
      <div ref={videoContainer} >
        
      </div>
    </div>
  );
}

export default App;
