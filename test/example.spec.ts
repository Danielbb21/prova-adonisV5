// import test from 'japa'
// import { JSDOM } from 'jsdom'
// import supertest from 'supertest'
// import User from 'App/Models/User'

// const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

// test.group('Welcome', () => {
//   // test('ensure home page works', async (assert) => {
//   //   const { text } = await supertest(BASE_URL).get('/').expect(200)
//   //   const { document } = new JSDOM(text).window
//   //   const title = document.querySelector('.title')

//   //   assert.exists(title)
//   //   assert.equal(title!.textContent!.trim(), 'It Works!')
//   // })

//   test('ensure user password gets hashed during save', async (assert) => {
//     const user = new User()
//     user.email = 'virk12345@adonisjs.com'
//     user.password = 'secret'
//     await user.save()
//     console.log(user.password);
//     assert.notEqual(user.password, 'secret')
//   })
//   test('shoul test', async (assert) => {
//     const user = new User()
//     user.email = 'teste@adonisjs.com'
//     user.password = 'secret'
//     user.isAdmin = true;
//     await user.save()

//     const teste = await supertest(BASE_URL).post('/login').send({
//       email: user.email,
//       password: 'secret'
//     });
//     // console.log(teste.body);

//     const { token } = teste.body.token;
//     const data = await supertest(BASE_URL).post('/games').set('Authorization', `Bearer ${token}`).send({
//       type: "teste1238",
//       description: "Escolha 10 números dos 16 disponíveis na quina. 5, 4, 3 ou 2 acertos. São seis sorteios semanais e seis chances de ganhar.",
//       range: 20,
//       price: 30,
//       "max-number": 12,
//       color: "#00FF00",
//       "min-cart-value": 30
//     });
//     console.log(data.statusCode);
//     console.log(data.body);

//     console.log(token)
//   })
// })
