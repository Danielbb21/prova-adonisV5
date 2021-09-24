import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game';
import User from 'App/Models/User';
import CreateGameValidator from 'App/Validators/CreateGameValidator';
import UpdateGameValidator from 'App/Validators/UpdateGameValidator';


export default class GamesController {

  public async store({ request, response, auth, bouncer }: HttpContextContract) {
    const data = request.all();
    await request.validate(CreateGameValidator);
    const game = new Game();
    const user = await User.find(auth.user?.id);
    if (!user) {
      return response.status(400).json({ error: 'user not found' });
    }
    await bouncer.authorize('games')

    const gameAlreadyExists = await Game.findBy('type', data.type);
    if (gameAlreadyExists) {
      return response.status(400).json({ error: 'Game already exists' });
    }

    await game.merge(data).save();

    return response.status(201).json(game);
  }

  public async index({ response }: HttpContextContract) {
    try {
      const games = await Game.all();
      return games;
    }
    catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }

  public async update({ request, response, bouncer, auth }: HttpContextContract) {
    const user = await User.find(auth.user?.id);
    if (!user) {
      return response.status(400).json({ error: 'user not found' });
    }
    await bouncer.authorize('games');
    try {
      const { id } = request.params();

      const data = request.all();



      const game = await Game.find(id);
      if (!game) {
        return response.status(400).json({ error: 'Game not found' });
      }

      await request.validate(UpdateGameValidator);
      await game.merge(data).save();

      return game;
    }
    catch (err) {
      return response.status(500).json({ error: err.message });
    }
  }

  public async destroy({ request, response, auth, bouncer }: HttpContextContract) {
    const user = await User.find(auth.user?.id);
    if (!user) {
      return response.status(400).json({ error: 'user not found' });
    }
    await bouncer.authorize('games');

    try {
      const { id } = request.params();
      const game = await Game.find(id);

      if (!game) {
        return response.status(400).json({ error: 'Game not found' });
      }
      await game.delete();
      return response.json('ok');
    }
    catch (err) {
      return response.status(500).json({ error: err.message })
    }
  }
}
