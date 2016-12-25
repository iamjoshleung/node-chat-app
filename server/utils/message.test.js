const expect = require('expect')

let {generateMessage, generateLocationMessage} = require('./message')

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    let from = 'Joshua'
    let text = 'Hello you'
    let result = generateMessage(from, text)

    expect(result.from).toBe(from)
    expect(result.text).toBe(text)
    // or this, same as above two statements
    expect(result).toInclude({from, text})
    expect(result.createdAt).toBeA('number')
  })
})

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    let from = 'Joshua'
    let latitude = 49.221
    let longitude = 53.2141
    let url = `https://google.com/maps?q=${latitude},${longitude}`

    let result = generateLocationMessage(from, latitude, longitude)

    expect(result.from).toBe(from)
    expect(result.url).toBe(url)
    // or
    expect(result).toInclude({
      from,
      url
    })
    expect(result.createdAt).toBeA('number')
  })
})
