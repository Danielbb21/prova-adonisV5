import  Mail  from '@ioc:Adonis/Addons/Mail';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Gamble from 'App/Models/Gamble';
import User from 'App/Models/User';
import Game from 'App/Models/Game';
import CreateGambleValidator from 'App/Validators/CreateGambleValidator';
import UpdateGambleValidator from 'App/Validators/UpdateGambleValidator';

const formatDate = (date) => {

  const dateString = date.toLocaleDateString().split('/');

  const day = dateString[0];
  const month = dateString[1];
  const year = dateString[2];

  return `${day}/${month}/${year}`;
}

export default class GamblesController {

  public async store({ request, response, auth }: HttpContextContract) {
    const data = request.only(['data']);
    await request.validate(CreateGambleValidator);

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

      await user.related('gambles').saveMany(k);
      const games = await Game.all();

      const returnedElemenents = k.map((element) => {
        const game = games.find(g =>  g.id === element.game_id);
        const date = new Date();
        return { gameNumbers: element.gameNumbers, price: element.price, game_id: element.game_id, type: game?.type, color: game?.color, maxNumber: game?.maxNumber, date_game: formatDate(date) };
      });
      await Mail.sendLater((message) => {
        message
          .from('tgl@teste.com')
          .to(user.email)
          .subject('New bet')
          .htmlView('emails/new_bet', {name: user.name, betNumbers: returnedElemenents})
      });

      return response.json(returnedElemenents);
    }


  }

  public async index({  response, auth }: HttpContextContract) {
    if (auth.user?.id) {

      const gambles = await Gamble.query().where('user_id', auth.user.id);
      return response.json(gambles);
    }
  }

  public async update({ request, response }: HttpContextContract) {
    const { id } = request.params();
    const gamble = await Gamble.find(id);
    const data = request.all();
    await request.validate(UpdateGambleValidator);
    if (!gamble) {
      return response.status(400).json({ error: 'Gamble not found' })
    }
    await gamble.merge(data).save();

    return gamble;

  }

  public async destroy({request, response}:HttpContextContract){
      const {id} = request.params();
      const gamble = await Gamble.find(id);

      if(!gamble){
        return response.status(400).json({error: 'Gamble not found'});

      }

      await gamble.delete();

      return response.json({message: 'deleted'})
  }
}
