import { DatabaseQueryBuilder } from '@riao/dbal';
import { MsSqlBuilder } from './sql-builder';

export class MsSqlQueryBuilder extends DatabaseQueryBuilder {
	public getSqlType() {
		return MsSqlBuilder;
	}

	public insertOutput(primaryKey: string): this {
		this.sql.append(`OUTPUT INSERTED.[${primaryKey}] AS [${primaryKey}] `);

		return this;
	}

	public selectTop(limit: number): this {
		this.sql.append('TOP ' + limit + ' ');

		return this;
	}

	public limit(nRecords: number): this {
		return this;
	}

	public uuid(): this {
		this.sql.append('NEWID()');

		return this;
	}
}
