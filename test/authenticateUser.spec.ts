import test from 'japa'
// import { JSDOM } from 'jsdom'
import supertest from 'supertest'
import User from 'App/Models/User'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Authenticate User', () => {
  test('Should return a token when the credentials are valid', async (assert) => {
    // const data = await supertest(BASE_URL).post('/users').send({
    //   name: 'Daniel',
    //   email: 'daniel123@teste.com',
    //   password: '123456',
    //   password_confirmation: '123456',
    //   isAdmin: true
    // });
    const user = new User()
    user.email = 'auth@adonisjs.com'
    user.password = '123456'
    await user.save()
    // const users = await User.all();
    const data1 = await supertest(BASE_URL).post('/login').send({

      email: 'auth@adonisjs.com',
      password: '123456'
    });

    const { body } = data1;

    assert.property(body, 'token');

  })

  test('Should not get the user authenticated when using invalid credentials', async (assert) => {
    const user = new User()
    user.email = 'auth1@adonisjs.com'
    user.password = '123456'
    await user.save()
    // const users = await User.all();
    const data1 = await supertest(BASE_URL).post('/login').send({

      email: 'auth1@adonisjs.com',
      password: '1234567'
    });
    const { body } = data1;

    assert.notProperty(body, 'token');
  })

  test('Should be able to acess private routes when authenticated', async (assert) => {
    const user = new User()
    user.email = 'teste1@adonisjs.com'
    user.password = 'secret'
    user.isAdmin = true;
    await user.save();
    const auth = await supertest(BASE_URL).post('/login').send({
      email: user.email,
      password: 'secret'
    });
    const {token} = auth.body.token;

    const data = await supertest(BASE_URL).get('/users/games').set('Authorization', `Bearer ${token}`);
    assert.equal(data.status, 200);
  })
  test('Should not be able to acess private routes when authenticated', async (assert) =>{
    const user = new User()
    user.email = 'teste12@adonisjs.com'
    user.password = 'secret'
    user.isAdmin = true;
    await user.save();
    // const auth = await supertest(BASE_URL).post('/login').send({
    //   email: user.email,
    //   password: 'secret'
    // });
    // const {token} = auth.body.token;

    const data = await supertest(BASE_URL).get('/users/games');
    assert.equal(data.status, 401);
  })
})
