import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Gamble from 'App/Models/Gamble';
import User from 'App/Models/User';

export default class GamblesController {

  public async store({ request, response, auth }: HttpContextContract) {
    const data = request.only(['data']);

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
      const returnedElemenents = k.map((element) => {
        return { game_numbers: element.gameNumbers, price: element.price, game_id: element.game_id };
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
