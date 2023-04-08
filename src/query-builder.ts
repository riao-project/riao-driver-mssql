import { DatabaseQueryBuilder } from 'riao-dbal/src';

export class MsSqlQueryBuilder extends DatabaseQueryBuilder {
	protected placeHolderId = 1;

	public appendPlaceholder(): this {
		// mssql uses incrementing placeholders in the format @p1, @p2, ...
		this.sql += `@p${this.placeHolderId} `;
		this.placeHolderId++;

		return this;
	}
}
