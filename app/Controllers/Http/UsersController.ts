import Mail from '@ioc:Adonis/Addons/Mail';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import CreateUserValidator from 'App/Validators/CreateUserValidator';
import UpdateUserValidator from 'App/Validators/UpdateUserValidator';
import { subWeeks } from 'date-fns';

const formatDate2 = (date) => {
  const dateSeperated = date.split('/');
  const day = dateSeperated[0];
  const month = dateSeperated[1];
  const year = dateSeperated[2];

  return `${year}-${month}-${day}`;
}

export default class UsersController {

  public async create({ request, response }: HttpContextContract) {
    const { name, email, password, isAdmin } = request.only(['name', 'email', 'password', 'isAdmin']);
    await request.validate(CreateUserValidator);
    const userExists = await User.findBy('email', email);
    if (userExists) {
      return response.status(400).json({ error: 'This email is already in use' });
    }
    const user = await User.create({ name, email, password, isAdmin });

    await user.save();
    await Mail.sendLater((message) => {
      message
        .from('tgl@teste.com')
        .to(user.email)
        .subject('Welcome')
        .htmlView('emails/new_user', { name: user.name, link: 'localhost:3000' })
    });

    return response.status(201).json(user);
  }
  public async index({ response }: HttpContextContract) {

    const users = await User.all();
    return response.json(users);
  }

  public async update({ request, response, auth }: HttpContextContract) {
    const data = request.only(['name', 'email', 'password']);
    await request.validate(UpdateUserValidator);
    // console.log('auth', auth.user?.id);
    // const {id} = request.params();
    const userExist = await User.find(auth.user?.id);
    if (!userExist) {
      return response.status(400).json({ error: 'User not found' });

    }

    await userExist.merge(data).save();

    return userExist;
  }

  public async delete({ request, response }: HttpContextContract) {
    const { id } = request.params();
    const user = await User.find(id);
    if (!user) {
      return response.status(400).json({ error: 'User not found' });
    }

    await user.delete();
    return response.status(200).json('ok');
  }

  public async show({ auth, response }: HttpContextContract) {
    const user = await User.find(auth.user?.id);
    if (auth.user?.id) {

      if (!user) {
        return response.status(400).json({ error: 'User not found' });
      }
      const all = await User.query().withCount('gambles').preload('gambles').where('id', auth.user.id);
      return all;
    }
  }
  public async absentUsers({ }: HttpContextContract) {
    const date = new Date();
    console.log('date', date);
    const dateOneWeekMore = subWeeks(date, 1);
    console.log('one week more', dateOneWeekMore);
    const dateBeginnigDay = formatDate2( dateOneWeekMore.toLocaleDateString());
    console.log("dateBeginnigDay", dateBeginnigDay);

    const user = await User.query().where('isAdmin', false);
    const users2 = await User.query().where('isAdmin', false).andWhereIn('id', User.query().where('last_game_date' ,'<', dateOneWeekMore ).orWhereNull('last_game_date').select('id'));

    users2.map(async(user) => {
        console.log(user.name)
      await Mail.sendLater((message) => {
        message
          .from('tgl@teste.com')
          .to(user.email)
          .subject('Lets play again')
          .htmlView('emails/abcent_users', { name: user.name, link: 'localhost:3000' })
      });
    })

    return {user,users2};
  }
}
