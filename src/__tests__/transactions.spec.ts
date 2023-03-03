import request from 'supertest';
import { execSync } from 'node:child_process';
import { describe, test, beforeAll, afterAll, expect } from 'vitest';

import { app } from '../app';
import { beforeEach } from 'node:test';

// O módulo execSync server para executar comandos no terminal através do código;

describe('[2e2] - Transactions routes tests', () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	beforeEach(() => {
		execSync('npm run knex migrate:rollback --all');
		execSync('npm run knex migrate:latest');
	});

	test('Should be able to create a new transaction', async () => {
		await request(app.server)
			.post('/transactions')
			.send({
				title: 'New transaction',
				amount: 5000,
				type: 'credit',
			})
			.expect(201);
	});

	test('Should be able to list all transactions', async () => {
		const createTransactionResponse = await request(app.server).post('/transactions').send({
			title: 'New transaction',
			amount: 5000,
			type: 'credit',
		});

		const cookies = createTransactionResponse.get('Set-Cookie');

		const listTransactionsResponse = await request(app.server).get('/transactions').set('Cookie', cookies).expect(200);
		console.log(listTransactionsResponse.body.transactions);
		expect(listTransactionsResponse.body.transactions).toEqual([
			expect.objectContaining({
				title: 'New transaction',
				// amount: 5000,
			}),
		]);
	});
});
