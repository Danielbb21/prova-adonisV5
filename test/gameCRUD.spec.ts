import test from 'japa'
// import { JSDOM } from 'jsdom'
import supertest from 'supertest'
import User from 'App/Models/User'
import Game from 'App/Models/Game';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('Games\' CRUD ', () => {
  test('Should permite a admin create a game', async (assert) => {
    const user = new User()
    user.name = 'Admin'
    user.email = 'admin@teste.com'
    user.password = 'secret'
    user.isAdmin = true;
    await user.save()

    const auth = await supertest(BASE_URL).post('/login').send({
      email: user.email,
      password: 'secret'
    });


    const { token } = auth.body.token;
    const data = await supertest(BASE_URL).post('/games').set('Authorization', `Bearer ${token}`).send({
      type: "lotofacil",
      description: "Escolha 10 números dos 16 disponíveis na quina. 5, 4, 3 ou 2 acertos. São seis sorteios semanais e seis chances de ganhar.",
      range: 20,
      price: 30,
      "max-number": 12,
      color: "#00FF00",
      "min-cart-value": 30
    });
    assert.equal(data.status, 201)
  })

  test('Should not permit a non admin create a game', async (assert) => {
    const user = new User()
    user.name = 'No Admin'
    user.email = 'noadmin@teste.com'
    user.password = 'secret'
    user.isAdmin = false;
    await user.save();


    const auth = await supertest(BASE_URL).post('/login').send({
      email: user.email,
      password: 'secret'
    });


    const { token } = auth.body.token;
    const data = await supertest(BASE_URL).post('/games').set('Authorization', `Bearer ${token}`).send({
      type: "Quina",
      description: "Escolha 10 números dos 16 disponíveis na quina. 5, 4, 3 ou 2 acertos. São seis sorteios semanais e seis chances de ganhar.",
      range: 20,
      price: 30,
      "max-number": 12,
      color: "#00FF00",
      "min-cart-value": 30
    });

    assert.notEqual(data.status, 201);
  })

  test('Should not permit a non logged user create a game', async (assert) => {
    const data = await supertest(BASE_URL).post('/games').send({
      type: "Quina",
      description: "Escolha 10 números dos 16 disponíveis na quina. 5, 4, 3 ou 2 acertos. São seis sorteios semanais e seis chances de ganhar.",
      range: 20,
      price: 30,
      "max-number": 12,
      color: "#00FF00",
      "min-cart-value": 30
    });
    assert.equal(data.status, 401);
  })

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

  test('Should not update a game using a non logged account', async (assert) => {
    const game = new Game;
    game.type = 'teste12347';
    game.description = 'teste description';
    game.range = 10;
    game.price = 10;
    game.maxNumber = 5;
    game.color = 'red';
    game.minCartValue = 30;
    await game.save();


    const data = await supertest(BASE_URL).delete(`/games/${game.id}`);

    assert.equal(data.status, 401);
  })

  test('Should not create a game with the same type column', async (assert) => {
    const user = new User()
    user.name = 'Admin1'
    user.email = 'adm1in@teste.com'
    user.password = 'secret'
    user.isAdmin = true;
    await user.save()

    const auth = await supertest(BASE_URL).post('/login').send({
      email: user.email,
      password: 'secret'
    });


    const { token } = auth.body.token;
    const data = await supertest(BASE_URL).post('/games').set('Authorization', `Bearer ${token}`).send({
      type: "lotofacil",
      description: "Escolha 10 números dos 16 disponíveis na quina. 5, 4, 3 ou 2 acertos. São seis sorteios semanais e seis chances de ganhar.",
      range: 20,
      price: 30,
      "max-number": 12,
      color: "#00FF00",
      "min-cart-value": 30
    });
    assert.equal(data.status, 400)
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

  // test('teste', async(assert) => {
  //   const game = new Game;
  //   game.type = 'teste teste123';
  //   game.description = 'teste description';
  //   game.range = 10;
  //   game.price = 10;
  //   game.maxNumber = 5;
  //   game.color = 'red';
  //   game.minCartValue = 30;
  //   await game.save();

  //   const user = new User();
  //   user.name = 'user223456';
  //   user.email = 'user2223456@teste.com';
  //   user.password = 'secret';
  //   user.isAdmin = true;
  //   await user.save();

  //   const auth = await supertest(BASE_URL).post('/login').send({
  //     email: user.email,
  //     password: 'secret'
  //   });
  //   const { token } = auth.body.token;
  //   const data = await supertest(BASE_URL).post('/gamble').set('Authorization', `Bearer ${token}`).send({
  //     data: [

  //       {
  //           gameNumbers: [1,2,8,9,12],
  //     price: 30,
  //     game_date: "2021-9-21 23:59:17",
  //       game_id: game.id
  //       },
  //         {
  //         gameNumbers: [1,2,8,9,12],
  //     price: 30,
  //     game_date: "2021-9-21 23:59:17",
  //       game_id: game.id
  //       }
  //     ]
  //   })
  //   console.log('DATA STATUS', data.status);
  // })

})
