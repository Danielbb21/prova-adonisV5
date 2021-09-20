import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Game from 'App/Models/Game';


export default class GamesController {

  public async store({ request, response }: HttpContextContract) {
    const data = request.all();

    const game = new Game();
    const gameAlreadyExists = await Game.findBy('type', data.type);
    if (gameAlreadyExists) {
      return response.status(400).json({ error: 'Game already exists' });
    }

    await game.merge(data).save();

    return game;
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

  public async update({ request, response }: HttpContextContract) {
    try {
      const { id } = request.params();

      const data = request.all();
      const game = await Game.find(id);
      if (!game) {
        return response.status(400).json({ error: 'Game not found' });
      }
      await game.merge(data).save();

      return game;
    }
    catch (err) {
        return response.status(500).json({error: err.message});
    }
  }

  public async destroy({request, response}:HttpContextContract){
      try{
        const {id} = request.params();
        const game = await Game.find(id);

        if(!game){
          return response.status(400).json({error: 'Game not found'});
        }
        await game.delete();
        return response.json('ok');
      }
      catch(err){
        return response.status(500).json({error: err.message})
      }
  }
}