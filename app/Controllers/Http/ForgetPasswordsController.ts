import User  from 'App/Models/User';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import crypto from 'crypto';
import Mail from '@ioc:Adonis/Addons/Mail';

import { addHours,  isAfter } from 'date-fns';
import ForgetPasswordValidator from 'App/Validators/ForgetPasswordValidator';
import ResetPasswordValidator from 'App/Validators/ResetPasswordValidator';

export default class ForgetPasswordsController {

  public async store({request, response}: HttpContextContract){
    const {email} = request.only(['email']);
    await request.validate(ForgetPasswordValidator);
    const userExists = await User.findBy('email', email);
    const cry = crypto.randomBytes(10).toString('hex');

    if(!userExists){
      return response.status(400).json({error: 'User not found'});
    }
    userExists.token = cry;
    userExists.token_created_at = new Date();

    await userExists.save();
    await Mail.send((message) => {
      message
        .from('tgl@teste.com')
        .to(userExists.email)
        .subject('Forget Password')
        .htmlView('emails/forget', {name: userExists.name,email: userExists.email, token: userExists.token})
    })
    return userExists;
  }

  public async resetPassword({request, response}: HttpContextContract){
      const {token, password} = request.only(['token', 'password']);
      const user = await User.findBy('token', token);
      await request.validate(ResetPasswordValidator);

      if(!user){
        return response.status(400).json({error:'User not found'});
      }
      if(user.token_created_at){
        const validDate = addHours(user.token_created_at, 2);
        const atualDate = new Date();
        if(isAfter(atualDate, validDate)){
          return response.status(400).json({error: 'Invalid Credentials'});
        }
        user.password = password;
        user.token = '';
        user.token_created_at = null;

        await user.save();
        return user;
      }
      return response.status(400).json({error:'Sommeting went wrong'});
  }
}
