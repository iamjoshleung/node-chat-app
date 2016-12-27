var socket = io()

function scrollToBottom() {
  // selectors
  var messages = jQuery('#messages')
  var newMessage = messages.children('li:last-child')

  // height
  var clientHeight = messages.prop('clientHeight')
  var scrollTop = messages.prop('scrollTop')
  var scrollHeight = messages.prop('scrollHeight')
  var newMessageHeight = newMessage.innerHeight()
  var lastMessageHeight = newMessage.prev().innerHeight()

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight)
  }

}

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
  scrollToBottom()
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
  scrollToBottom()
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
