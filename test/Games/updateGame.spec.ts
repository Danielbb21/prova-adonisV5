import test from 'japa'
// import { JSDOM } from 'jsdom'
import supertest from 'supertest'
import User from 'App/Models/User'
import Game from 'App/Models/Game';


const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('Update Game', () => {
  test('Should update a game using a correct id', async (assert) => {
    const game = new Game;
    game.type = 'teste';
    game.description = 'teste description';
    game.range = 10;
    game.price = 10;
    game.maxNumber = 5;
    game.color = 'red';
    game.minCartValue = 30;
    await game.save();

    const user = new User();
    user.name = 'user2';
    user.email = 'user2@teste.com';
    user.password = 'secret';
    user.isAdmin = true;
    await user.save();

    const auth = await supertest(BASE_URL).post('/login').send({
      email: user.email,
      password: 'secret'
    });
    const { token } = auth.body.token;

    const data = await supertest(BASE_URL).put(`/games/${game.id}`).set('Authorization', `Bearer ${token}`).send({
      type: 'teste2'
    })

    assert.equal(data.status, 200);
  });

  test('Should not update a game using a uncorrect id', async (assert) => {
    const user = new User();
    user.name = 'user22';
    user.email = 'user22@teste.com';
    user.password = 'secret';
    user.isAdmin = true;
    await user.save();

    const auth = await supertest(BASE_URL).post('/login').send({
      email: user.email,
      password: 'secret'
    });
    const { token } = auth.body.token;

    const data = await supertest(BASE_URL).put(`/games/48484848f`).set('Authorization', `Bearer ${token}`).send({
      type: 'teste2'
    })

    assert.equal(data.status, 400);
  })

  test('Should not update a game using a non Admin account', async (assert) => {
    const game = new Game;
    game.type = 'teste123';
    game.description = 'teste description';
    game.range = 10;
    game.price = 10;
    game.maxNumber = 5;
    game.color = 'red';
    game.minCartValue = 30;
    await game.save();

    const user = new User();
    user.name = 'user222';
    user.email = 'user222@teste.com';
    user.password = 'secret';
    user.isAdmin = false;
    await user.save();

    const auth = await supertest(BASE_URL).post('/login').send({
      email: user.email,
      password: 'secret'
    });
    const { token } = auth.body.token;

    const data = await supertest(BASE_URL).put(`/games/${game.id}`).set('Authorization', `Bearer ${token}`).send({
      type: 'teste236'
    })

    assert.notEqual(data.status, 200);
  })
  test('Should not update a game using a non logged account', async (assert) => {
    const game = new Game;
    game.type = 'teste1234';
    game.description = 'teste description';
    game.range = 10;
    game.price = 10;
    game.maxNumber = 5;
    game.color = 'red';
    game.minCartValue = 30;
    await game.save();


    const data = await supertest(BASE_URL).put(`/games/${game.id}`).send({
      type: 'teste236'
    })

    assert.equal(data.status, 401);
  })

  test('Should not update a game using a previus used type column', async (assert) => {
    const game = new Game;
    game.type = 'teste teste';
    game.description = 'teste description';
    game.range = 10;
    game.price = 10;
    game.maxNumber = 5;
    game.color = 'red';
    game.minCartValue = 30;
    await game.save();

    const user = new User();
    user.name = 'user223';
    user.email = 'user2223@teste.com';
    user.password = 'secret';
    user.isAdmin = true;
    await user.save();

    const auth = await supertest(BASE_URL).post('/login').send({
      email: user.email,
      password: 'secret'
    });
    const { token } = auth.body.token;

    const data = await supertest(BASE_URL).put(`/games/${game.id}`).set('Authorization', `Bearer ${token}`).send({
      type: 'teste2'
    })
    assert.notEqual(data.status, 200);
  })

})
