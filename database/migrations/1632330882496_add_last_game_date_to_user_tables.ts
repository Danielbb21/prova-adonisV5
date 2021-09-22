import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddLastGameDateToUserTables extends BaseSchema {
  protected tableName = 'add_last_game_date_to_user_tables'

  public async up () {
    this.schema.alterTable('users', (table) => {
      table.timestamp('last_game_date')

     })
  }

  public async down () {
    this.schema.alterTable('users', (table) =>{
      table.dropColumn('last_game_date')

    })
  }
}
