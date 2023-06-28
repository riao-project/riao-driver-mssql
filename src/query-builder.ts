import { DatabaseQueryBuilder } from '@riao/dbal';

export class MsSqlQueryBuilder extends DatabaseQueryBuilder {
	protected placeHolderId = 1;

	public appendPlaceholder(): this {
		// mssql uses incrementing placeholders in the format @p1, @p2, ...
		this.sql += `@p${this.placeHolderId} `;
		this.placeHolderId++;

		return this;
	}

	public insertOutput(primaryKey: string): this {
		this.sql += `OUTPUT INSERTED.${primaryKey} AS ${primaryKey} `;

		return this;
	}

	public selectTop(limit: number): this {
		this.sql += 'TOP ' + limit + ' ';

		return this;
	}

	public limit(nRecords: number): this {
		return this;
	}
}
