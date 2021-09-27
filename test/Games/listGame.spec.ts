import test from 'japa'
// import { JSDOM } from 'jsdom'
import supertest from 'supertest'
import User from 'App/Models/User'


const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('List Game', () =>{
  test('Should permit a logged user list all games', async (assert) => {
    const user = new User();
    user.name = 'user';
    user.email = 'user@teste.com';
    user.password = 'secret';
    user.isAdmin = false;
    await user.save();
    const auth = await supertest(BASE_URL).post('/login').send({
      email: user.email,
      password: 'secret'
    });


    const { token } = auth.body.token;

    const data = await supertest(BASE_URL).get('/games').set('Authorization', `Bearer ${token}`);

    assert.equal(data.status, 200);
  })

  test('Should not permit a non logged user list all games', async (assert) => {
    const user = new User();
    user.name = 'user1';
    user.email = 'user1@teste.com';
    user.password = 'secret';
    user.isAdmin = false;
    await user.save();


    const data = await supertest(BASE_URL).get('/games');

    assert.equal(data.status, 401);
  })
})
