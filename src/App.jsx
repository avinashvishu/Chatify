import React, { useEffect, useMemo, useState } from 'react';
import {io} from 'socket.io-client';
import {Container,Typography,TextField,Button,Stack} from '@mui/material'
import ScrollToBottom from 'react-scroll-to-bottom';
import { css } from '@emotion/css';

 const ROOT_CSS = css({
    height: 200,
    // width: 400
  });
const App = () => {

 
  const socket = useMemo(()=>io(`https://socket-api-service.onrender.com/`),[])
  const [messages,setMessages]=useState([])
  const[messageSent,setMessage]=useState("")
  const[room,setRoom]=useState("")
  const[UserId,setId]=useState("")
  const [roomName,setRoomName]=useState('')
    useEffect(()=>{
    socket.on("connect",()=>{
      console.log('connnected',socket.id)
      setId(socket.id)
    });
    socket.on("recived-message",({messageSent,UserId})=>{
      console.log("this Id is from backend ",UserId,socket.id);
      if(!(UserId==socket.id)){
      setMessages((messages)=>[...messages,messageSent]);
      }
  })
    // socket.on("welcome",(s)=>{console.log(s)})

    return()=>{
       socket.disconnect();
    }
  },[])
 
  const handleSubmit=(e)=>{
    e.preventDefault();
    socket.emit("message",{messageSent,room,UserId});
    setMessages((messages)=>[...messages,messageSent]);
    setMessage("")
  }

  const JoinRoomHandler= (e)=>{
    e.preventDefault();
    socket.emit("Join",roomName);
    setRoomName("")
  }
  return (
    <Container maxWidth="sm">
  
      <Typography variant="h1" component="div" gutterBottom>
              Chatify
      </Typography>

      <Typography variant="h6" component="div" gutterBottom>
              Unique ID : {UserId} 
      </Typography>

      <form onSubmit={JoinRoomHandler} >
        <h4>Join Room</h4>
        <TextField value={roomName}
        onChange={e=>setRoomName(e.target.value)} 
        id='outlined-basic' 
        label='Room Name' 
        variant='outlined' />
        <Button type='submit' variant="contained" color="primary">
          Join
        </Button>
      </form>

      <form onSubmit={handleSubmit}>
        <TextField value={messageSent}
        onChange={e=>setMessage(e.target.value)} 
        id='outlined-basic' 
        label='Message' 
        variant='outlined' />

        <TextField value={room}
        onChange={e=>setRoom(e.target.value)} 
        id='outlined-basic' 
        label='Room Name/Unique ID' variant='outlined' />

        <Button type='submit' variant="contained" color="primary">
          Send
        </Button>
      </form>
      <div style={{backgroundColor:'#FFF8E3'}}>
      <ScrollToBottom className={ROOT_CSS}>
        {
          
          messages.map((m,i)=>(
            <Typography key={i} variant='h6' component="div" gutterBottom >
              {m}
            </Typography>
          ))
        }
      </ScrollToBottom>
      </div>
    </Container>
  )
}

export default App