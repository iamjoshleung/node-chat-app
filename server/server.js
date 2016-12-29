const path = require('path')
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const {Users} = require('./utils/Users')

const app = express()
const server = http.createServer(app)
let io = socketIO(server)
let {generateMessage, generateLocationMessage} = require('./utils/message')
let {isRealString} = require('./utils/validation')
let users = new Users()

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

app.use(express.static(publicPath))

io.on('connection', (socket) => {
  console.log('connected to the client')

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id)

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room))
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`))
    }
  })

  socket.on('createMessage', (data, callback) => {
    let user = users.getUser(socket.id)

    if(user && isRealString(data.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, data.text))
    }

    callback()
  })

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and room are required')
    } else {

      users.removeUser(socket.id)
      socket.join(params.room)
      users.addUser(socket.id, params.name, params.room)
      io.to(params.room).emit('updateUserList', users.getUserList(params.room))


      socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat room'))

      socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`))

      callback()
    }
  })

  socket.on('createLocationMessage', (data) => {
    let user = users.getUser(socket.id)

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, data.latitude, data.longitude))
    }

  })
})

server.listen(port, () => {
  console.log(`Listening on PORT ${port}`)
})
