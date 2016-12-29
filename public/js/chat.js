var socket = io()
var params

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

  params = jQuery.deparam(window.location.search)

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err)
      window.location.href = '/'
    } else {
      console.log('no err')
    }
  })
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

socket.on('updateUserList', function (users) {
  var ol = jQuery('<ol></ol')

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user))
  })

  jQuery('#users').html(ol)
})

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault()

  var messageTextBox = jQuery('[name=message]')

  socket.emit('createMessage', {
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
