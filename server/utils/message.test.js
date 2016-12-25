const expect = require('expect')

let {generateMessage} = require('./message')

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
