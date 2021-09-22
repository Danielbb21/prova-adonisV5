import Mail from '@ioc:Adonis/Addons/Mail';
import { BaseTask } from 'adonis5-scheduler/build'
import User from 'App/Models/User';
import { subWeeks } from 'date-fns';

export default class AbsentUser extends BaseTask {
	public static get schedule() {
		return '0 0 9 * * *'
	}
	/**
	 * Set enable use .lock file for block run retry task
	 * Lock file save to `build/tmpTaskLock`
	 */
	public static get useLock() {
		return false
	}

	public async handle() {
    	// this.logger.info('Handled')
      const date = new Date();
    console.log('date', date);
    const dateOneWeekMore = subWeeks(date, 1);


    const users =await User.query().where('isAdmin', false).andWhereIn('id', User.query().where('last_game_date' ,'<', dateOneWeekMore ).orWhereNull('last_game_date').select('id'));

    users.map(async(user) => {

      await Mail.sendLater((message) => {
        message
          .from('tgl@teste.com')
          .to(user.email)
          .subject('Lets play again')
          .htmlView('emails/abcent_users', { name: user.name, link: 'localhost:3000' })
      });
    })
    console.log('aqui')
  	}
  // public async run(){
  //   console.log('teste')
  // }
}
