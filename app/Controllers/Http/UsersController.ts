import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';

export default class UsersController {

  public async create({ request, response }: HttpContextContract) {
    const { name, email, password, isAdmin } = request.only(['name', 'email', 'password', 'isAdmin']);

    const userExists = await User.findBy('email', email);
    if(userExists){
      return response.status(400).json({error: 'This email is already in use'});
    }
    const user = await User.create({name, email, password, isAdmin});

    await user.save();
    return response.status(201).json(user);
  }
}
