import * as mssql from 'mssql';

import {
	DatabaseConnectionOptions,
	DatabaseDriver,
	DatabaseQueryResult,
	DatabaseQueryTypes,
} from 'riao-dbal/src';
import { MsSqlDataDefinitionBuilder } from './ddl-builder';
import { MsSqlQueryBuilder } from './query-builder';
import { num2str } from './param';

export type MsSqlConnectionOptions = DatabaseConnectionOptions;

export class MsSqlDriver extends DatabaseDriver {
	dataDefinitionBulider = MsSqlDataDefinitionBuilder;
	queryBuilder = MsSqlQueryBuilder;

	protected conn: mssql.ConnectionPool;

	public async connect(options: MsSqlConnectionOptions): Promise<this> {
		this.conn = new mssql.ConnectionPool({
			server: options.host,
			port: options.port,
			database: options.database,
			user: options.username,
			password: options.password,
			options: {
				trustServerCertificate: true,
			},
			pool: {
				max: 10,
				min: 0,
				idleTimeoutMillis: 30000,
			},
		});

		// TODO: Add error handler
		// IMPORTANT: Always attach an error listener to created
		//	connection. Whenever something goes wrong with the
		//	connection it will emit an error and if there is
		//	no listener it will crash your application with
		//	an uncaught error.
		// https://www.npmjs.com/package/mssql

		await this.conn.connect();

		return this;
	}

	public async disconnect(): Promise<void> {
		await this.conn.close();
	}

	public async query(
		options: DatabaseQueryTypes
	): Promise<DatabaseQueryResult> {
		let { sql, params } = this.toDatabaseQueryOptions(options);
		params = params ?? [];

		try {
			const rows = await this.preparedQuery({ sql, params });

			return {
				results: Array.isArray(rows) ? rows : [rows],
			};
		}
		catch (e) {
			e.message += ' ' + JSON.stringify({ sql, params });
			throw e;
		}
	}

	public async getVersion(): Promise<string> {
		const { results } = await this.query({
			sql: 'SELECT @@version',
		});

		if (results && results.length && results[0]) {
			const result = results[0][0];

			const match = result[Object.keys(result)[0]].match(
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

		for (const param of params) {
			const id = 'p' + num2str(paramIndex);

			if (typeof param === 'number') {
				query.input(id, mssql.Numeric);
			}
			else if (typeof param === 'boolean') {
				query.input(id, mssql.Numeric);
			}
			else if (typeof param === 'string') {
				query.input(id, mssql.Text);
			}

			paramMap[id] = param;
			paramIndex++;
		}

		await query.prepare(sql);
		const result = await query.execute(paramMap);
		await query.unprepare();

		return result.recordsets;
	}
}
