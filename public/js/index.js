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

socket.on('newLocationMessage', function (message) {
  var li = jQuery('<li></li>')
  var a = jQuery('<a target="_blank">My current location</a>')

  li.text(`${message.from}: `)
  a.attr('href', message.url)
  li.append(a)
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

var geoLocationBtn = jQuery('#geolocation')
geoLocationBtn.on('click', function (e) {
  if (!navigator.geolocation) {
    return alert('You browser doesn\'t support geolocation')
  }

  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  }, function () {
    alert('Unable to fetch location')
  })
})
