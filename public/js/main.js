const socket = io()
const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')

//GET username and room from URL
const {username , room} = QS.parse(location.search , {
    ignoreQueryPrefix: true
})

//Join chatroom
socket.emit('JoinRoom' , {username, room})

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


{/* <div class="message">
    <p class="meta">Mary <span>9:15pm</span></p>
    <p class="text">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi,
        repudiandae.
    </p>
</div> */}

//output message to DOM
function outputMessage(msg){
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p> <p class="text">${msg.text}</p>`
    chatMessages.appendChild(div)
}
