/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world1243' }
})

Route.group(() => {
  Route.post('/forget', 'ForgetPasswordsController.store')
  Route.put('/reset', 'ForgetPasswordsController.resetPassword')
}).prefix('/password')

Route.group(() => {
  Route.post('/', 'UsersController.create')
  Route.group(() => {
    Route.get('/', 'UsersController.index')
    Route.put('/', 'UsersController.update')
    Route.get('/games', 'UsersController.show')
  }).middleware('auth')
  Route.delete('/:id', 'UsersController.delete')

  Route.get('/abcent', 'UsersController.absentUsers')
}).prefix('/users');

Route.post('/login', 'AuthController.create')

Route.resource('games', 'GamesController')
  .apiOnly()
  .middleware({
    '*': ['auth']
  });

Route.resource('gamble', 'GamblesController')
  .apiOnly()
  .middleware({
    '*': ['auth']
  })

