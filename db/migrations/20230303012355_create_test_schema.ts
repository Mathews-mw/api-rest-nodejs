import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createSchema('test-api-node-test');
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropSchemaIfExists('test-api-node-test', true);
}
