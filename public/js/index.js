var socket = io()

socket.on('connect', function () {
  console.log('connected to the server')
})

socket.on('disconnect', function () {
  console.log('disconnected to the server')
})

socket.on('newMessage', function (data) {
  var formattedTime = moment(data.createdAt).format('h:mm a')
  var template = jQuery('#message-template').html()
  var html = Mustache.render(template, {
    text: data.text,
    from: data.from,
    createdAt: formattedTime
  })

  jQuery('#messages').append(html)
})

socket.on('newLocationMessage', function (data) {
  var formattedTime = moment(data.createdAt).format('h:mm a')
  var template = jQuery('#location-message-template').html()
  var html = Mustache.render(template, {
    from: data.from,
    createdAt: formattedTime,
    url: data.url
  })

  jQuery('#messages').append(html)
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
