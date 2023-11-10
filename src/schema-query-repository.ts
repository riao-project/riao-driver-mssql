import {
	DatabaseRecord,
	SchemaQueryRepository,
	SchemaTable,
	columnName,
} from '@riao/dbal';
import { MsSqlBuilder } from './sql-builder';

export class MsSqlSchemaQueryRepository extends SchemaQueryRepository {
	protected tablesTable = 'sys.tables';
	protected columnsTable = 'sys.columns';

	protected databaseNameColumn = 'TABLE_CATALOG';
	protected tableNameColumn = 'name';
	protected tableTypeColumn = 'TYPE_DESC';
	protected columnPositionColumn = 'column_id';

	protected returnedTableTypes: Record<any, 'table' | 'view'> = {
		USER_TABLE: 'table',
		VIEW: 'view',
	};

	public getSqlType() {
		return MsSqlBuilder;
	}

	protected getTablesQueryWhere() {
		return null;
	}

	public async getPrimaryKeyQuery(
		table: string
	): Promise<null | DatabaseRecord> {
		const sql =
			'SELECT ' +
			`sys.identity_columns.name AS '${this.columnNameColumn}' ` +
			'FROM sys.identity_columns ' +
			'LEFT JOIN sys.tables ON ' +
			'sys.identity_columns.object_id = sys.tables.object_id ' +
			'WHERE sys.tables.name = @p1';

		const params = [table];

		const results = (await this.driver.query({ sql, params })).results;

		return results.length ? results[0] : null;
	}

	protected async getColumnsQuery(table: string): Promise<DatabaseRecord[]> {
		return await this.find({
			table: this.columnsTable,
			columns: [
				{ column: 'sys.columns.name', as: this.columnNameColumn },
				{ column: 'sys.types.name', as: this.columnTypeColumn },
			],
			join: [
				{
					type: 'LEFT',
					table: 'sys.types',
					on: {
						'sys.types.user_type_id': columnName(
							'sys.columns.user_type_id'
						),
					},
				},
				{
					type: 'LEFT',
					table: 'sys.tables',
					on: {
						'sys.tables.object_id': columnName(
							'sys.columns.object_id'
						),
					},
				},
			],
			where: {
				'sys.tables.name': table,
			},
			orderBy: { [this.columnPositionColumn]: 'ASC' },
		});
	}
}
