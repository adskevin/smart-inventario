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

  Route.get('/signin', 'UserController.signin')
  Route.post('/newuser', 'UserController.newuser')
  Route.get('/edituser', 'UserController.edituser')
  Route.post('/saveedituser', 'UserController.saveedituser')

  Route.post('/newcategory', 'CategoryController.newcategory')
  Route.delete('/deletecategory/:id', 'CategoryController.deletecategory')
  Route.get('/categories', 'CategoryController.categories')
  Route.get('/editcategory/:id', 'CategoryController.editview')
  Route.post('/editcategory', 'CategoryController.editcategory')
}).middleware('checkLogin')

Route.on('/').render('login')
Route.post('/auth', 'LoginController.login')
Route.get('/logout', 'LoginController.logout')

Route.get('/changepass', 'UserController.changepass')
Route.post('/changepass', 'UserController.savenewpass')
Route.get('/preset/:hash/:email', 'UserController.preset')
Route.get('/presetview', 'UserController.presetview')
Route.post('/resemail', 'UserController.resemail')
