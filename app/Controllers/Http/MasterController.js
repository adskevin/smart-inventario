'use strict'

class MasterController {
  async home ({ request, session, view }) {
    let email = session.get('email', '');
    let name = session.get('name', '');
    let admin = session.get('admin', '');
    return view.render('master', {
      email: email,
      name: name,
      admin: admin
    });
  }
}

module.exports = MasterController
