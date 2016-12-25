var socket = io()

socket.on('connect', function () {
  console.log('connected to the server')
})

socket.on('disconnect', function () {
  console.log('disconnected to the server')
})

socket.on('newMessage', function (data) {
  console.log('Got new message', data)
  var li = jQuery('<li></li>')
  li.text(`${data.from}: ${data.text}`)

  jQuery('#messages').append(li)
})

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault()

  socket.emit('createMessage', {
    from: 'Josh',
    text: $('[name=message]').val()
  }, (data) => {
    console.log('Acknowledgement', data)
  })
})
