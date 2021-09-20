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
  public async index({ response}:HttpContextContract){

    const users = await User.all();
    return response.json(users);
  }

  public async update({request, response, auth}: HttpContextContract){
    const data = request.all();
    // console.log('auth', auth.user?.id);
    // const {id} = request.params();
    const userExist = await User.find(auth.user?.id);
    if(!userExist){
      return response.status(400).json({error: 'User not found'});

    }

    await userExist.merge(data).save();

    return userExist;
  }

  public async delete({request, response}: HttpContextContract){
    const {id} = request.params();
    const user = await User.find(id);
    if(!user){
     return  response.status(400).json({error: 'User not found'});
    }

    await user.delete();
    return response.status(200).json('ok');
  }
}
