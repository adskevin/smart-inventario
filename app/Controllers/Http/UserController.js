'use strict'
const User = use('App/Models/User')
const { validateAll, validate } = use('Validator')
const nodemailer = require('nodemailer')
const Env = use('Env')
const sha256 = require('sha256')

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

  async presetview ({ view }) {
    return view.render('preset');
  }

  async preset ({ params, session, response }) {
    let userFromBd = await User.findBy('email', params.email);
    if (!userFromBd) {
      session.flash({
        error: true
      });
      return response.redirect('/changepass');
    }
    if (userFromBd.resethash !== params.hash ) {
      session.flash({
        error: true
      });
      return response.redirect('/changepass');
    }
    session.flash({
      name: userFromBd.name,
      email: userFromBd.email
    });
    return response.redirect('/changepass')
  }

  async changepass ({ view, session }) {
    return view.render('changepass')
  }

  async savenewpass ({ request, session, response}) {
    const validation = await validateAll(request.all(), {
      email: 'required|email',
      password: 'required',
      confirmPassword: 'required',
    });

    // Mostrar mensagens de erro se falhar na validação
    if (validation.fails()) {
      session.flash({
        email: request.input('email'),
        name: request.input('name')
      });
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back');
    }

    let userFromBd = await User.findBy('email', request.input('email'));
    if (!userFromBd) {
      session.flash({
        email: true
      });
      return response.redirect('back');
    }

    userFromBd.resethash = null;
    userFromBd.password = request.input('password')
    userFromBd.save();
    session.flash({
      reset: true
    });
    return response.redirect('back');
  }

  async resemail ({ request, session, response }) {
    let validation = await validate(request.all(), {
      email: 'email|required'
    })
    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back');
    }
    let reqEmail = request.input('email');

    let userFromBd = await User.findBy('email', reqEmail);
    if (!userFromBd) {
      session.flash({
        emailSent: true
      });
      return response.redirect('back');
    }

    let hash = sha256('recuperação' + Date.now())

    userFromBd.resethash = hash;
    userFromBd.save();

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: "Outlook365",
      auth: {
        user: Env.get('SMTP_USER'),
        pass: Env.get('SMTP_PASS')
      },
    });
    const options = {
      from: `não responder - Smart Inventário <${ Env.get('SMTP_USER') }>`,
      to: reqEmail,
      subject: "Recuperação de senha",
      html: `
        <h1>Recuperação de senha</h1><br>
        <a href="${ Env.get('APP_URL', 'https://smart-inventario.herokuapp.com') }/preset/${ hash }/${ reqEmail }">Alterar minha senha</a><br>
        <br>
        <p>Clique no link acima para alterar sua senha</p>
      `
    }
    transporter.sendMail(options, function (err, info) {
      if(err) {
        console.log(err);
        return;
      }
      console.log("sent: " + info.response);
    })
    session.flash({
      emailSent: true
    });
    return response.redirect('back');
  }

  async edituser ({ request, session, view }) {
    let userEmail = session.get('email')
    let userFromBd = await User.findBy('email', userEmail);
    if (!userFromBd) {
      return response.redirect('back');
    }
    return view.render('edituser', { userName: userFromBd.name })
  }

  async saveedituser ({ request, session, response }) {
    let userFromBd = await User.findBy('email', session.get('email'));
    if (!userFromBd) {;
      return response.redirect('back');
    }
    userFromBd.name = request.input('name');
    await userFromBd.save();
    session.put('name', userFromBd.name);
    return response.redirect('back');
  }
}

module.exports = UserController
