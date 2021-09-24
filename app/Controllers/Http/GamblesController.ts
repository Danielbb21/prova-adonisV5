import Mail from '@ioc:Adonis/Addons/Mail';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Gamble from 'App/Models/Gamble';
import User from 'App/Models/User';
import Game from 'App/Models/Game';
import CreateGambleValidator from 'App/Validators/CreateGambleValidator';
import UpdateGambleValidator from 'App/Validators/UpdateGambleValidator';

interface ITeste{
  game_id: number;
  type: string;
  color: string;
  maxNumber: number;
  gameNumbers: number[];
  user_id: string;
}
const formatDate = (date) => {

  const dateString = date.toLocaleDateString().split('/');

  const day = dateString[0];
  const month = dateString[1];
  const year = dateString[2];

  return `${day}/${month}/${year}`;
}

// const formatDate2 = (date) => {
//   const dateSeperated = date.split('/');
//   const day = dateSeperated[0];
//   const month = dateSeperated[1];
//   const year = dateSeperated[2];

//   return `${year}-${month}-${day}`;
// }

export default class GamblesController {

  public async store({ request, response, auth }: HttpContextContract) {
    console.log('Aquiiii');

    const data = request.only(['data']);
    await request.validate(CreateGambleValidator);
    try{
      const user = await User.find(auth.user?.id);
      if (!user) {
        return response.status(400).json({ error: 'User not found' });
      }

      if (auth.user?.id) {
        const id = auth.user.id;

        const k: Gamble[] = [];



        data.data.map(element => {
          console.log('element', element);
          const a = new Gamble();
          a.gameNumbers = element.gameNumbers.toString();
          a.price = element.price;
          a.game_date = element.game_date;
          a.game = element.game_id;
          a.user_id = id;
          a.game_id = element.game_id;
          k.push(a);

        })


        const games = await Game.all();
        const teste = data.data.map((element) => {
          console.log('element', element);

          return { ...element, gameNumbers: element.gameNumbers.toString(), user_id:  1}
        });
        let teste2: ITeste[] = [];
        for (let i = 0; i < teste.length; i++) {
          let teste3 = { ...teste[i], type: '', color: '', maxNumber: 0 };
          for (let j = 0; j < games.length; j++) {
            console.log(teste[i].game_id,  games[j].id);
            console.log(teste[i].game_id ===  games[j].id);
            if (teste[i].game_id === games[j].id) {

              teste3.type = games[j].type
              teste3.color = games[j].color;
              teste3.maxNumber = games[j]['max-number']

              teste2.push(teste3);
            }
          }
        }
        console.log('teste2', teste2);
        teste2.map((game) => {

          const gameType = games.find(gm => gm.type === game.type);
          console.log('gameTyoe', gameType?.maxNumber);
          if(!gameType) {
            console.log('notttt');
            return;
          }
          const numbers = game.gameNumbers.toString().split(',');
          // numbers.map(num => {
          //   console.log('num', num);
          // });
         numbers.map(num => {
           if(+num > gameType.range){
             throw new Error('number out of bounds');
           }
         })
          console.log(gameType.maxNumber, game.gameNumbers.toString().split(',').length)
          if (gameType.maxNumber !== game.gameNumbers.toString().split(',').length) {
            throw new Error('mismatched game numbers')
          }
          // game.gameNumbers.map(num => {
          //   if(num > gameType.range){
          //     throw new Error('number out of bounds')
          //   }
          // });
          // console.log('game', game.gameNumbers.length);

        })

        user.last_game_date = new Date();
        // const t = new Date('2021-09-16T18:19:05.653Z');
        // user.last_game_date = t;

        // user.last_game_date = Date.parse('2021-09-14T18:11:00.763Z');
        await user.related('gambles').saveMany(k);


        // k.map((game) => {
        //   console.log('aquiii');
        //   const gameType = games.find(gm => gm.type === game.game.type);
        //   console.log(gameType!['max-number'], game.gameNumbers.split(',').length)
        //   if(!gameType) return;
        //   if (gameType['max-number'] !== game.gameNumbers.split(',').length) {
        //     throw new Error('mismatched game numbers')
        //   }
        // })

        const returnedElemenents = k.map((element) => {
          const game = games.find(g => g.id === element.game_id);
          const date = new Date();
          return { gameNumbers: element.gameNumbers, price: element.price, game_id: element.game_id, type: game?.type, color: game?.color, maxNumber: game?.maxNumber, date_game: formatDate(date) };
        });
        await Mail.sendLater((message) => {
          message
            .from('tgl@teste.com')
            .to(user.email)
            .subject('New bet')
            .htmlView('emails/new_bet', { name: user.name, betNumbers: returnedElemenents })
        });

        return response.json(returnedElemenents);
      }
    }
    catch(err){
      return response.status(400).json(err.message);
    }



  }

  public async index({ request, response, auth }: HttpContextContract) {

    if (auth.user?.id) {

      console.log('aqui');

      console.log(request.qs());
      const { page } = request.qs();
      const gambles = await Gamble.query().where('user_id', auth.user.id).preload('user').preload('game').paginate(page, 10);

      return response.json(gambles);
    }
  }

  public async update({ request, response, bouncer }: HttpContextContract) {
    const { id } = request.params();
    const gamble = await Gamble.find(id);

    const data = request.all();
    await request.validate(UpdateGambleValidator);
    if (!gamble) {
      return response.status(400).json({ error: 'Gamble not found' })
    }
    await bouncer.authorize('userBets', gamble);

    await gamble.merge(data).save();

    return gamble;

  }

  public async destroy({ request, response, bouncer }: HttpContextContract) {
    const { id } = request.params();
    const gamble = await Gamble.find(id);

    if (!gamble) {
      return response.status(400).json({ error: 'Gamble not found' });

    }
    await bouncer.authorize('userBets', gamble);
    await gamble.delete();

    return response.json({ message: 'deleted' })
  }
}
