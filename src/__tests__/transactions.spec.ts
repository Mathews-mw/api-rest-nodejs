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

		expect(listTransactionsResponse.body.transactions).toEqual([
			expect.objectContaining({
				title: 'New transaction',
				// amount: 5000,
			}),
		]);
	});

	test('Should be able to get a specifc transactions', async () => {
		const createTransactionResponse = await request(app.server).post('/transactions').send({
			title: 'New transaction',
			amount: 5000,
			type: 'credit',
		});

		const cookies = createTransactionResponse.get('Set-Cookie');

		const listTransactionsResponse = await request(app.server).get('/transactions').set('Cookie', cookies).expect(200);

		const transactionId = listTransactionsResponse.body.transactions[0].id;

		const getTransactionResponse = await request(app.server).get(`/transactions/${transactionId}`).set('Cookie', cookies).expect(200);

		expect(getTransactionResponse.body.transactions).toEqual(
			expect.objectContaining({
				title: 'New transaction',
			})
		);
	});

	test('Should be able to get the summary', async () => {
		const createTransactionResponse = await request(app.server).post('/transactions').send({
			title: 'Credit transaction',
			amount: 5000,
			type: 'credit',
		});

		const cookies = createTransactionResponse.get('Set-Cookie');

		await request(app.server).post('/transactions').set('Cookie', cookies).send({
			title: 'Debit transaction',
			amount: 2000,
			type: 'debit',
		});

		await request(app.server).post('/transactions/summary').send({
			title: 'New transaction',
			amount: 5000,
			type: 'credit',
		});

		const summaryResponse = await request(app.server).get('/transactions').set('Cookie', cookies).expect(200);

		expect(summaryResponse.body.summary).toEqual({
			ammount: 3000,
		});
	});
});
