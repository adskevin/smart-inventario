'use strict'
const User = use('App/Models/User')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class LoginController {
    async login ({ request, session, response }) {
        let email = session.get('email', '');
        if(email){
          session.clear();
        }
        let reqEmail = request.input('email');
        let reqPassword = request.input('password');
        try {
          let user = await User.findByOrFail('email', reqEmail);
          let isEqual = await Hash.verify(reqPassword, user.password);
          if (isEqual) {
            session.put("email", user.email);
            session.put("name", user.name);
            session.put("admin", user.admin);
            return response.redirect('/home');
          }
          // retornar erro ao logar
          console.log('erro senha');
          return response.redirect('/');
        } catch (err) {
          console.log('ero');
          console.log(err);
        }
    }

    async logout({ session, response }) {
      session.clear()
      return response.redirect('/');
    }
}

module.exports = LoginController
