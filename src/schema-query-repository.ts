import { DatabaseRecord, SchemaQueryRepository } from 'riao-dbal/src';

export class MsSqlSchemaQueryRepository extends SchemaQueryRepository {
	protected databaseNameColumn = 'TABLE_CATALOG';

	public async getPrimaryKeyQuery(
		table: string
	): Promise<null | DatabaseRecord> {
		const sql =
			`SELECT ${this.columnNameColumn} ` +
			'FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE ' +
			'WHERE OBJECTPROPERTY(OBJECT_ID(CONSTRAINT_SCHEMA + \'.\' + QUOTENAME(CONSTRAINT_NAME)), \'IsPrimaryKey\') = 1 ' +
			`AND ${this.databaseNameColumn} = @p1 AND ${this.tableNameColumn} = @p2`;

		const params = [this.database, table];

		const results = (await this.driver.query({ sql, params })).results;

		return results.length ? results[0] : null;
	}
}
