import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Gambles extends BaseSchema {
  protected tableName = 'gambles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('gameNumbers').notNullable()
      table
        .integer('user_id')
        .unsigned()
        .references('users.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

      table
        .integer('game_id')
        .unsigned()
        .references('games.id')

        .onUpdate('CASCADE')
        .onDelete('SET NULL')

      table.decimal('price').notNullable()
      table.timestamp('game_date')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
