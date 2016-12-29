const expect = require('expect')

let {isRealString} = require('./validation')

describe('isRealString', () => {
  it('should reject non-string values', () => {
    let str = 123
    let result = isRealString(str)

    expect(result).toBe(false)
  })

  it('should reject string with only spaces', () => {
    let str = '   '
    let result = isRealString(str)

    expect(result).toBe(false)
  })

  it('should allow string with non-space characters', () => {
    let str = '  a  '
    let result = isRealString(str)

    expect(result).toBe(true)
  })
})
