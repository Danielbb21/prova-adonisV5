import test from 'japa'
// import { JSDOM } from 'jsdom'
import supertest from 'supertest'
import User from 'App/Models/User'
import Game from 'App/Models/Game';


const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('Delete Game', () => {
  test('Should delete a game using a correct id', async (assert) => {
    const game = new Game;
    game.type = 'teste 123';
    game.description = 'teste description';
    game.range = 10;
    game.price = 10;
    game.maxNumber = 5;
    game.color = 'red';
    game.minCartValue = 30;
    await game.save();

    const user = new User();
    user.name = 'user215';
    user.email = 'user215@teste.com';
    user.password = 'secret';
    user.isAdmin = true;
    await user.save();

    const auth = await supertest(BASE_URL).post('/login').send({
      email: user.email,
      password: 'secret'
    });
    const { token } = auth.body.token;

    const data = await supertest(BASE_URL).delete(`/games/${game.id}`).set('Authorization', `Bearer ${token}`);

    assert.equal(data.status, 200);
  })

  test('Should not delete a game using a uncorrect id', async (assert) => {

    const user = new User();
    user.name = 'user2156';
    user.email = 'user2156@teste.com';
    user.password = 'secret';
    user.isAdmin = true;
    await user.save();

    const auth = await supertest(BASE_URL).post('/login').send({
      email: user.email,
      password: 'secret'
    });
    const { token } = auth.body.token;

    const data = await supertest(BASE_URL).delete(`/games/848484`).set('Authorization', `Bearer ${token}`);

    assert.equal(data.status, 400);
  })

  test('Should not delete a game using a non Admin account', async (assert) => {
    const game = new Game;
    game.type = 'teste123456';
    game.description = 'teste description';
    game.range = 10;
    game.price = 10;
    game.maxNumber = 5;
    game.color = 'red';
    game.minCartValue = 30;
    await game.save();

    const user = new User();
    user.name = 'user2227';
    user.email = 'user2227@teste.com';
    user.password = 'secret';
    user.isAdmin = false;
    await user.save();

    const auth = await supertest(BASE_URL).post('/login').send({
      email: user.email,
      password: 'secret'
    });
    const { token } = auth.body.token;

    const data = await supertest(BASE_URL).delete(`/games/${game.id}`).set('Authorization', `Bearer ${token}`);

    assert.notEqual(data.status, 200);
  })

  test('Should not delete a game using a non logged account', async (assert) => {
    const game = new Game;
    game.type = 'teste1234969';
    game.description = 'teste description';
    game.range = 10;
    game.price = 10;
    game.maxNumber = 5;
    game.color = 'red';
    game.minCartValue = 30;
    await game.save();


    const data = await supertest(BASE_URL).delete(`/games/${game.id}`).send({
      type: 'teste236'
    })

    assert.equal(data.status, 401);
  })
})
