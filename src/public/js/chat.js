let myUserName = ''
let socket = io()

// input ref
const userNameTitle = document.getElementById("userNameTitle")
const messageInput = document.getElementById("messageInput")
const messagesLog = document.getElementById("messagesLog")

// Sweet alert

Swal.fire({
    title: 'Login',
    text: 'Input username',
    input: 'email',
    allowOutsideClick: false
}).then((result)=>{
    myUserName = result.value
    userNameTitle.innerHTML = myUserName
})

// Socket

// listens
socket.on('chatMessage',({messages})=>{
    messagesLog.innerHTML = ''
    messages.forEach(m => {
        messagesLog.innerHTML += `${m.user}: ${m.message}</br>`
    })
})

// emits
messageInput.addEventListener('keyup',(e)=>{
    if(e.key == 'Enter'){
        socket.emit('chatMessage', {
            user: myUserName,
            message:e.target.value
        })
        e.target.value = ''
    }
})