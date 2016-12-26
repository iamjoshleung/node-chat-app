var socket = io()

socket.on('connect', function () {
  console.log('connected to the server')
})

socket.on('disconnect', function () {
  console.log('disconnected to the server')
})

socket.on('newMessage', function (data) {
  var formattedTime = moment(data.createdAt).format('h:mm a')
  var li = jQuery('<li></li>')
  li.text(`${data.from} (${formattedTime}): ${data.text}`)

  jQuery('#messages').append(li)
})

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a')
  var li = jQuery('<li></li>')
  var a = jQuery('<a target="_blank">My current location</a>')

  li.text(`${message.from} (${formattedTime}): `)
  a.attr('href', message.url)
  li.append(a)
  jQuery('#messages').append(li)
})

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault()

  var messageTextBox = jQuery('[name=message]')

  socket.emit('createMessage', {
    from: 'Josh',
    text: messageTextBox.val()
  }, (data) => {
    messageTextBox.val('')
  })
})

var geoLocationBtn = jQuery('#send-location')
geoLocationBtn.on('click', function (e) {
  if (!navigator.geolocation) {
    return alert('You browser doesn\'t support geolocation')
  }

  geoLocationBtn.attr('disabled', 'disabled').text('Sending location...')

  navigator.geolocation.getCurrentPosition(function (position) {
    geoLocationBtn.removeAttr('disabled').text('Send location')
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    })
  }, function () {
    geoLocationBtn.removeAttr('disabled').text('Send location')
    alert('Unable to fetch location')
  })
})
