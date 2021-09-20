import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddTokenToUsers extends BaseSchema {
  protected tableName = 'add_token_to_users'

  public async up () {
    this.schema.alterTable('users', (table) => {
     table.string('token')
     table.timestamp('token_created_at')
    })
  }

  public async down () {
    this.schema.alterTable('users', (table) =>{
      table.dropColumn('token')
      table.dropColumn('token_created_at')
    })
  }
}
