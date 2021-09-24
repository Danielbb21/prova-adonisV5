import test from 'japa'
// import { JSDOM } from 'jsdom'
import supertest from 'supertest'
import User from 'App/Models/User'
import Game from 'App/Models/Game';

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;
const sortNumbers = (max: number, range: number) => {
  let arrayOfChosenNumbers: Number[] = [];

  while (arrayOfChosenNumbers.length !== max) {
    let numberSorted = Math.floor(Math.random() * range) + 1;

    let isAlreadyChosed = arrayOfChosenNumbers.find(
      (number) => number === numberSorted
    );
    if (!isAlreadyChosed) {
      arrayOfChosenNumbers.push(numberSorted);
    }
  }
  return arrayOfChosenNumbers;

}
test.group('Create Bet', () => {
  test('Should not create a bet when is not authenticated', async (assert) => {

    const game = new Game;
    game.type = 'teste4184';
    game.description = 'teste description';
    game.range = 10;
    game.price = 10;
    game.maxNumber = 5;
    game.color = 'red';
    game.minCartValue = 30;
    await game.save();

    const user = new User();
    user.name = 'user284484';
    user.email = 'user2959848@teste.com';
    user.password = 'secret';
    user.isAdmin = true;
    await user.save();

    const auth = await supertest(BASE_URL).post('/login').send({
      email: user.email,
      password: 'secret'
    });
    const { token } = auth.body.token;
    const data = await supertest(BASE_URL).post('/gamble').send({
      data: [

        {
          gameNumbers: [1, 2, 3, 6, 8],
          price: 30,
          game_date: "2021-9-21 23:59:17",
          game_id: game.id
        },
        {
          gameNumbers: [1, 2, 8, 9, 10],
          price: 30,
          game_date: "2021-9-21 23:59:17",
          game_id: game.id
        }
      ]
    })
    // console.log(data);
    // console.log(data.status);
    assert.equal(data.status, 401);
  })

  test('Should create a mega-sena game with aleatory numbers', async (assert) => {
    const game = new Game();
    game.type = 'Mega-Sena';
    game.description = 'Escolha 6 números dos 60 disponíveis na mega-sena. Ganhe com 6, 5 ou 4 acertos. São realizados dois sorteios semanais para você apostar e torcer para ficar milionário.';
    game.range = 60;
    game.price = 4.5;
    game.maxNumber = 6;
    game.color = '#01AC66';
    game.minCartValue = 30;

    await game.save();
    const user = new User();
    user.email = 'teste@teste1.com';
    user.password = 'secret';
    user.isAdmin = true;
    await user.save();

    const auth = await supertest(BASE_URL).post('/login').send({
      email: user.email,
      password: 'secret'
    });
    const { token } = auth.body.token;
    const aleatoryNumbers = sortNumbers(game.maxNumber, game.range);
    const data = await supertest(BASE_URL).post('/gamble').set('Authorization', `Bearer ${token}`).send({
      data: [

        {
          gameNumbers: aleatoryNumbers,
          price: 30,
          game_date: "2021-9-21 23:59:17",
          game_id: game.id
        }
      ]
    })
    console.log(data.body);
    assert.equal(data.status, 200);
  })

  test('Should not create a mega-sena game with wrong numbers', async(assert) => {

  })
})
