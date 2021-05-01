'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.get('/home', 'MasterController.home')
  // Route.on('/cadastro').render('signin')
  Route.get('/signin', 'UserController.signin')
  Route.post('/newuser', 'UserController.newuser')
}).middleware('checkLogin')

Route.on('/').render('login')
Route.post('/auth', 'LoginController.login')
Route.get('/logout', 'LoginController.logout')

