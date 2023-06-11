const express = require('express')
const app = express()
const http = require('http').createServer(app)
const firebase= require('firebase')

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyApzqKsy-KjHnv-3gE40Jm7I7c306lx04s",
    authDomain: "wassup-archi.firebaseapp.com",
    projectId: "wassup-archi",
    storageBucket: "wassup-archi.appspot.com",
    messagingSenderId: "344500662233",
    appId: "1:344500662233:web:d178376ed600dadd4133c8"
  });

const db = firebaseApp.firestore();
// const storage = firebase.storage();


const PORT = process.env.PORT || 5000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('message', (msg) => {
        db.collection("chats").add({
            user: msg.user,
            message: msg.message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
        socket.broadcast.emit('message', msg)
    })

    socket.on('join', (name) => {
        // console.log(name)
        // socket.emit('message' , {msg: `Welcome ${name}`})
        db.collection("user").add({
            name: name,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          });
          console.log(name)
          socket.broadcast.emit('join', name)
    });

})