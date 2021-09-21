import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Gamble from 'App/Models/Gamble';
import Game from 'App/Models/Game';
import User from 'App/Models/User';
interface Teste {
  gameNumbers: string;
  price: number;
  game_date: string;
  game: number;
  user_id: number;
  game_id: number;
}

export default class GamblesController {

  public async store({ request, response, auth }: HttpContextContract) {
    const data = request.only(['data']);

    // const { gameNumbers, price, game_date, game_id } = request.only(['gameNumbers', 'price', 'game_date', 'game_id']);
    const gamble = new Gamble();
    const user = await User.find(auth.user?.id);
    if (!user) {
      return response.status(400).json({ error: 'User not found' });
    }

    if (auth.user?.id) {
      const id = auth.user.id;
      const game = new Game();
      const k: Gamble[] = [];


      let teste: Teste[] = [];
      data.data.map(element =>{
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
      return response.json(user);
    }


  }
}
