import * as mssql from 'mssql';

import {
	DatabaseConnectionOptions,
	DatabaseDriver,
	DatabaseQueryResult,
	DatabaseQueryTypes,
} from '@riao/dbal';
import { Transaction } from '@riao/dbal/database/transaction';

export type MsSqlConnectionOptions = DatabaseConnectionOptions;

export class MsSqlDriver extends DatabaseDriver {
	public override conn: mssql.ConnectionPool = undefined;

	public async connect(options: MsSqlConnectionOptions): Promise<this> {
		this.conn = new mssql.ConnectionPool({
			server: options.host,
			port: options.port,
			database: options.database,
			user: options.username,
			password: options.password,
			options: {
				trustServerCertificate: true,
				useUTC: true,
			},
			pool: {
				max: 10,
				min: 0,
				idleTimeoutMillis: 30000,
			},
		});

		await this.conn.connect();

		return this;
	}

	public async disconnect(): Promise<void> {
		await this.conn.close();
	}

	public async query(
		options: DatabaseQueryTypes
	): Promise<DatabaseQueryResult> {
		const queries = this.toDatabaseQueryOptions(options);
		let result;

		for (const query of queries) {
			let { sql, params } = query;
			params = params ?? [];

			try {
				let rows;

				if (params.length) {
					const queryResult = await this.preparedQuery({ sql, params });
					rows = queryResult.length ? queryResult[0] : queryResult;
					if (queryResult.length) console.log('prepare columns', queryResult.columns || queryResult[0].columns);
				}
				else {
					const queryResult = await this.conn.query(sql);
					rows = queryResult.recordset ?? [];
					console.log('query columns', queryResult.recordset?.columns);
				}

				if (Array.isArray(rows) && rows.length > 0) {
					for (const row of rows) {
						for (const key in row) {
							if (typeof row[key] === 'string') {
								try {
									const parsed = JSON.parse(row[key]);
									if (typeof parsed === 'object' && parsed !== null) {
										row[key] = parsed;
									}
									else if (Array.isArray(parsed)) {
										row[key] = parsed;
									}
									else if (parsed === true || parsed === false || typeof parsed === 'number') {
										// in riao-driver tests, if we do JSON parse it might incorrectly parse valid strings?
										// e.g. "true" parsed as boolean true, or "123" parsed as number 123.
									}
								} catch (e) {}
							}
						}
					}
				}

				result = { results: rows };
			}
			catch (e) {
				e.message +=
					' ' +
					JSON.stringify({ sql, params }, (key, value) =>
						typeof value === 'bigint' ? value.toString() : value
					);
				throw e;
			}
		}

		return result;
	}

	public async getVersion(): Promise<string> {
		const { results } = await this.query({
			sql: 'SELECT @@version as version',
		});

		if (results && results.length && results[0]) {
			const result = results[0];

			const match = result.version.match(
				/- ([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/
			);

			if (match) {
				return match[1];
			}
		}

		return '';
	}

	protected async preparedQuery({ sql, params }): Promise<any> {
		const query = new mssql.PreparedStatement(this.conn);
		let paramIndex = 1;
		const paramMap = {};

		for (let param of params) {
			const id = 'p' + paramIndex;

			if (typeof param === 'number') {
				if (('' + param).includes('.')) {
					query.input(id, mssql.VarChar);
					param = '' + param;
				}
				else {
					query.input(id, mssql.Int);
				}
			}
			else if (typeof param === 'boolean') {
				query.input(id, mssql.Bit);
			}
			else if (param instanceof Date) {
				query.input(id, mssql.DateTime);
			}
			else if (typeof param === 'string') {
				query.input(id, mssql.NVarChar);
			}
			else if (typeof param === 'bigint') {
				query.input(id, mssql.VarChar);
				param = param.toString();
			}
			else if (param instanceof Buffer) {
				query.input(id, mssql.VarBinary);
			}
			else if (typeof param === 'object' && param !== null) {
				query.input(id, mssql.NVarChar);
				param = JSON.stringify(param);
			}
			else {
				query.input(id, mssql.VarChar);
			}

			paramMap[id] = param;
			paramIndex++;
		}

		let result;

		try {
			await query.prepare(sql);
			result = await query.execute(paramMap);
			await query.unprepare();
		}
		catch (e) {
			await query.unprepare();
			throw e;
		}

		console.log('execute result', !!result.recordset, result.recordset?.columns);
		return result.recordsets;
	}

	public async transaction<T>(
		fn: (transaction: Transaction) => Promise<T>,
		transaction: Transaction
	): Promise<T> {
		const mssqlTransaction = await new mssql.Transaction(this.conn);
		let result: T;

		await mssqlTransaction.begin();

		transaction.driver.conn = mssqlTransaction;

		transaction.ddl.setDriver(transaction.driver);
		transaction.query.setDriver(transaction.driver);

		try {
			result = await fn(transaction);
			await mssqlTransaction.commit();
		}
		catch (e) {
			await mssqlTransaction.rollback();

			throw e;
		}

		return result;
	}
}
