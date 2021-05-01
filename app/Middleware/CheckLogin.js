'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class CheckLogin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response, session }, next) {
    let email = session.get('email', '');
    if (email) {
      // call next to advance the request
      return await next()
    }
    return response.redirect('/');
  }
}

module.exports = CheckLogin
