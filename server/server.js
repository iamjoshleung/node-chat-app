const path = require('path')
const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const app = express()
const server = http.createServer(app)
let io = socketIO(server)
let {generateMessage} = require('./utils/message')

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

app.use(express.static(publicPath))

io.on('connection', (socket) => {
  console.log('connected to the client')

  socket.on('disconnect', () => {
    console.log('disconnected to the client')
  })

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat room'))

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'))

  socket.on('createMessage', (data, callback) => {
    console.log('New email created', data)
    io.emit('newMessage', generateMessage(data.from, data.text))
    callback('I have acknowledged this.')
  })
})

server.listen(port, () => {
  console.log(`Listening on PORT ${port}`)
})
