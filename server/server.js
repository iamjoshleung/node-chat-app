const path = require('path')
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const app = express()
const server = http.createServer(app)
let io = socketIO(server)

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

app.use(express.static(publicPath))

io.on('connection', (socket) => {
  console.log('connected to the client')

  socket.on('disconnect', () => {
    console.log('disconnected to the client')
  })

  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the chat room',
    createdAt: new Date().getTime()
  })

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined',
    createdAt: new Date().getTime()
  })

  socket.on('createMessage', (data) => {
    console.log('New email created', data)
    io.emit('newMessage', {
      from: data.from,
      text: data.text,
      createdAt: new Date().getTime()
    })
  })
})

server.listen(port, () => {
  console.log(`Listening on PORT ${port}`)
})
