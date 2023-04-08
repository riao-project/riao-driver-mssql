import { CreateTableOptions, DataDefinitionBuilder } from 'riao-dbal/src';

export class MsSqlDataDefinitionBuilder extends DataDefinitionBuilder {
	public getAutoIncrement(): string {
		return 'IDENTITY';
	}

	public ifNotExists(): this {
		return this;
	}

	public createTable(options: CreateTableOptions): this {
		if (options.ifNotExists) {
			this.sql += `IF OBJECT_ID(N'dbo.${options.name}', N'U') IS NULL BEGIN `;
		}

		super.createTable(options);

		if (options.ifNotExists) {
			this.sql += ' END';
		}

		return this;
	}
}
