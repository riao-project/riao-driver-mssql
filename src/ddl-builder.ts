import {
	CreateTableOptions,
	CreateUserOptions,
	DataDefinitionBuilder,
	DropUserOptions,
	GrantOptions,
} from 'riao-dbal/src';
import { ChangeColumnOptions } from 'riao-dbal/src/ddl/alter-table';

export class MsSqlDataDefinitionBuilder extends DataDefinitionBuilder {
	public constructor() {
		super();

		this.columnTypes = <any>{
			...this.columnTypes,
			BOOL: 'BIT',
			DOUBLE: 'REAL',
		};
	}

	public getAutoIncrement(): string {
		return 'IDENTITY';
	}

	public ifNotExists(): this {
		return this;
	}

	public createTable(options: CreateTableOptions): this {
		if (options.ifNotExists) {
			this.sql += `IF OBJECT_ID(N'${options.name}', N'U') IS NULL BEGIN `;
		}

		super.createTable(options);

		if (options.ifNotExists) {
			this.sql += ' END';
		}

		return this;
	}

	public changeColumn(options: ChangeColumnOptions): this {
		// Rename column first, if required
		if (options.column !== options.options.name) {
			this.sql +=
				`EXEC sp_rename '${options.table}.${options.column}', ` +
				`'${options.options.name}', 'COLUMN';`;
		}

		options.column = '';

		return super.changeColumn(options);
	}

	public createUserPassword(password: string): this {
		this.sql += `WITH PASSWORD = '${password}' `;

		return this;
	}

	public createUser(options: CreateUserOptions): this {
		this.sql += `CREATE LOGIN ${options.name} `;
		this.createUserPassword(options.password);
		this.sql += '; ';

		this.sql += `CREATE USER ${options.name} FOR LOGIN ${options.name};`;

		return this;
	}

	public grantOnDatabase(database: string): this {
		this.sql += 'DATABASE::' + database;

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
			this.sql += `USE master; GRANT CONTROL SERVER TO ${options.to.join(
				', '
			)}; `;

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
				this.sql += `IF EXISTS (SELECT * FROM sys.server_principals WHERE name = N'${user}') `;
			}

			this.sql += `DROP LOGIN ${user}; `;
			this.sql += 'DROP USER ';

			if (options.ifExists) {
				this.sql += 'IF EXISTS ';
				this.sql += user + '; ';
			}
		}

		return this;
	}
}
