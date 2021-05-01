'use strict'
const User = use('App/Models/User')
const { validateAll } = use('Validator')

class UserController {
  async create ({ request, response, session }) {
    const user = new User()
    user.name = request.input('name')
    user.email = request.input('email')
    user.password = request.input('password')
    user.role = request.input('role')
    await user.save()
  }

  async newuser ({ request, response, view, session }) {
    const validation = await validateAll(request.all(), {
      name: 'required|min:3|max:255',
      email: 'required|email',
      password: 'required',
      confirmPassword: 'required',
    });

    // Mostrar mensagens de erro se falhar na validação
    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back');
    }

    const user = new User()
    user.name = request.input('name')
    user.email = request.input('email')
    user.password = request.input('password')
    user.admin = request.input('admin')
    await user.save()
    return view.render('login');
  }

  async signin ({ request, response, view, session }) {
    return view.render('signin');
  }
}

module.exports = UserController
