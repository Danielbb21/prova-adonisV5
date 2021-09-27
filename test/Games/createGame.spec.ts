import test from 'japa'
// import { JSDOM } from 'jsdom'
import supertest from 'supertest'
import User from 'App/Models/User'


const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;


test.group('Craete Game', () => {
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
})
