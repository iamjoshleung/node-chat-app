const _ = require('lodash')

class Users {
  constructor () {
    this.users = []
  }

  addUser (id, name, room) {
    let user = {id, name, room}
    this.users.push(user)
    return user
  }

  getUserList (room) {
    let users = this.users.filter((user) => user.room === room)
    let namesArray = users.map((user) => user.name)
    return namesArray
  }

  removeUser (id) {
    let usersArray = _.remove(this.users, (user) => {
      return user.id === id
    })
    return usersArray[0]
  }

  getUser (id) {
    for (let i = 0, n = this.users.length; i < n; i++) {
      if (this.users[i].id === id) {
        return this.users[i]
      }
    }
    return undefined
  }
}

module.exports = {Users}
