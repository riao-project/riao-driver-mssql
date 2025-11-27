import {
	CreateTableOptions,
	CreateUserOptions,
	DataDefinitionBuilder,
	DatabaseQueryBuilder,
	DropUserOptions,
	GrantOptions,
	TriggerOptions,
} from '@riao/dbal';
import { ChangeColumnOptions } from '@riao/dbal/ddl/alter-table';
import { MsSqlBuilder } from './sql-builder';
import { MsSqlQueryBuilder } from './query-builder';

export class MsSqlDataDefinitionBuilder extends DataDefinitionBuilder {
	protected queryBuilderType = MsSqlQueryBuilder;

	public constructor() {
		super();

		this.columnTypes = <any>{
			...this.columnTypes,
			UUID: 'uniqueidentifier',
			BOOL: 'BIT',
			TINYINT: 'SMALLINT', // mssql tinyint can't be signed
			DOUBLE: 'REAL',
			TEXT: 'VARCHAR(max)', // TODO: nvarchar instead?
			BLOB: 'VARBINARY(max)',
			TIMESTAMP: 'DATETIME2',
		};
	}

	public getSqlType() {
		return MsSqlBuilder;
	}

	public disableForeignKeyChecks(): this {
		this.sql.append(
			'EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all"'
		);

		return this;
	}

	public enableForeignKeyChecks(): this {
		this.sql.append(
			'exec sp_MSforeachtable @command1="print \'?\'", @command2="ALTER TABLE ? WITH NOCHECK CHECK CONSTRAINT all"'
		);

		return this;
	}

	public columnAutoIncrement() {
		this.sql.append('IDENTITY ');

		return this;
	}

	public ifNotExists() {
		return this;
	}

	public columnDefaultFalse(): this {
		this.sql.append('0 ');

		return this;
	}

	public columnDefaultTrue(): this {
		this.sql.append('1 ');

		return this;
	}

	public createTable(options: CreateTableOptions): this {
		if (options.ifNotExists) {
			this.sql.append(
				`IF OBJECT_ID(N'${options.name}', N'U') IS NULL BEGIN `
			);
		}

		super.createTable(options);

		if (options.ifNotExists) {
			this.sql.append(' END');
		}

		return this;
	}

	public changeColumn(options: ChangeColumnOptions): this {
		// Rename column first, if required
		if (options.column !== options.options.name) {
			this.sql.append(
				`EXEC sp_rename '${options.table}.${options.column}', ` +
					`'${options.options.name}', 'COLUMN';`
			);
		}

		options.column = '';

		return super.changeColumn(options);
	}

	public createUserPassword(password: string): this {
		this.sql.append(`WITH PASSWORD = '${password}' `);

		return this;
	}

	public createUser(options: CreateUserOptions): this {
		this.sql.append(`CREATE LOGIN ${options.name} `);
		this.createUserPassword(options.password);
		this.sql.append('; ');

		this.sql.append(
			`CREATE USER ${options.name} FOR LOGIN ${options.name};`
		);

		return this;
	}

	public grantOnDatabase(database: string): this {
		this.sql.append('DATABASE::' + database);

		return this;
	}

	public grant(options: GrantOptions): this {
		if (!Array.isArray(options.privileges)) {
			options.privileges = [options.privileges];
		}

		if (!Array.isArray(options.to)) {
			options.to = [options.to];
		}

		if (options.privileges.includes('ALL') && options.on === '*') {
			this.sql.append(
				`USE master; GRANT CONTROL SERVER TO ${options.to.join(', ')}; `
			);

			return this;
		}

		return super.grant(options);
	}

	public dropUser(options: DropUserOptions): this {
		if (!Array.isArray(options.names)) {
			options.names = [options.names];
		}

		for (const user of options.names) {
			if (options.ifExists) {
				this.sql.append(
					`IF EXISTS (SELECT * FROM sys.server_principals WHERE name = N'${user}') `
				);
			}

			this.sql.append(`DROP LOGIN ${user}; `);
			this.sql.append('DROP USER ');

			if (options.ifExists) {
				this.sql.append('IF EXISTS ');
				this.sql.append(user + '; ');
			}
		}

		return this;
	}

	public override createTriggerTableEvent(options: TriggerOptions): this {
		this.createTriggerTable(options.table);
		this.createTriggerEvent(options);

		return this;
	}

	public override createTriggerEvent(options: TriggerOptions): this {
		if (options.timing === 'BEFORE') {
			this.sql.append('AFTER ');
		}
		else {
			this.sql.append(options.timing + ' ');
		}

		this.sql.append(options.event + ' ');

		return this;
	}

	public override createTriggerForEachRow(): this {
		return this;
	}

	public override createTriggerBeginStatement(): this {
		this.sql.append('AS BEGIN ');

		return this;
	}
}
