const socket = io()
const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')


//GET username and room from URL
const {username , room} = Qs.parse(location.search , {
    ignoreQueryPrefix: true
})


//Join chatroom
socket.emit('joinRoom' , {username, room})


//msg from Server
socket.on('message' , message => {
    console.log(message)
    outputMessage(message)

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight
})

//Message submit
chatForm.addEventListener('submit' , (e) => {
    e.preventDefault()

    //get message text
    const msg = e.target.elements.msg.value

    //emit message to server
    socket.emit('chatMessage' , msg)
    e.target.elements.msg.value = ""
    e.target.elements.msg.focus()
})


//Get room and users
socket.on('roomUsers' , ({room, users}) => {
    outputRoomName(room)
    outputUsers(users)
})

//add Room Name to DOM
function outputRoomName(room){
    roomName.innerText = room
}

//add users Names to DOM
function outputUsers(users) {
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`
}


//output message to DOM
function outputMessage(msg){
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p> <p class="text">${msg.text}</p>`
    chatMessages.appendChild(div)
}
