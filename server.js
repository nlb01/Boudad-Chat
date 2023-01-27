const express = require('express')
const path = require('path')
const http = require('http')
const app = express()
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')

const server = http.createServer(app)
const io = socketio(server)
const botName = 'ChatBotCord'
const {userJoin , getCurrentUser, getRoomUsers , userLeave} = require('./utils/users')


//Set static folder
app.use(express.static(path.join(__dirname, 'public')))

//Run when a client connects
io.on('connection', socket => {
    socket.on('joinRoom' , ({username , room}) => {
        const user = userJoin(socket.id , username, room)

        socket.join(user.room)

        // welcome user
        socket.emit('message' , formatMessage(botName, 'Welcome to ChatCord'))

        //Broadcast when user connects
        socket.broadcast.to(user.room).emit(
            'message' , formatMessage(botName , user.username + ' has joined the chat'))
        
        // send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })
    /////socket.emit (only to the client or user)
    /////socket.broadcast.emit (to all other clients or users exceot the active one)
    /////io.emit(to all users or clients)


    //listen for chat message
    socket.on('chatMessage' , (msg) => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message' , formatMessage( user.username ,msg))

    })

    //runs when a user disconnects
    socket.on('disconnect' , () => {
        const user = userLeave(socket.id)

        if(user) {
            io.to(user.room).emit('message' , formatMessage(botName, user.username + ' has left the chat'))
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
        
    })

})

const PORT = 3000 || process.env.PORT

server.listen(PORT , () => console.log(`Server running on port: ${PORT}`))
