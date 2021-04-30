'use strict'
const User = use('App/Models/User')

class UserController {
  async create ({ request, response, session }) {
    const user = new User()
    user.username = request.input('username')
    user.email = request.input('email')
    user.password = request.input('password')
    await user.save()
  }
}

module.exports = UserController
