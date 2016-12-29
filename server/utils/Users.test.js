const expect = require('expect')
const {Users} = require('./Users')

describe('Users', () => {
  let users

  beforeEach(() => {
    users = new Users()
    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'Node Course'
    }, {
      id: '2',
      name: 'Jen',
      room: 'React Course'
    }, {
      id: '3',
      name: 'Julie',
      room: 'Node Course'
    }]
  })

  it('should add new user', () => {
    let users = new Users()
    let user = {
      id: '123',
      name: 'Joshua',
      room: 'NodeJS'
    }
    let resUser = users.addUser(user.id, user.name, user.room)

    expect(users.users).toEqual([user])

  })

  it('should return names for Node Course', () => {
    let userList = users.getUserList('Node Course')
    expect(userList).toEqual([users.users[0].name, users.users[2].name])
  })

  it('should return names for React Course', () => {
    let userList = users.getUserList('React Course')
    expect(userList).toEqual([users.users[1].name])
  })

  it('should remove a user', () => {
    let userId = '2'
    let user = users.removeUser(userId)
    expect(user.id).toBe(userId)
    expect(users.users.length).toBe(2)
  })

  it('should not remove a user', () => {
    let userId = '111'
    let user = users.removeUser(userId)
    expect(user).toNotExist()
    expect(users.users.length).toBe(3)
  })

  it('should find a user', () => {
    let userId = '2'
    let user = users.getUser(userId)
    expect(user.id).toBe(userId)
  })

  it('should not find a user', () => {
    let userId = '111'
    let user = users.getUser(userId)
    expect(user).toNotExist()
  })
})
