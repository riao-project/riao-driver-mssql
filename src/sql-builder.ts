import { SqlBuilder } from '@riao/dbal/builder';

export class MsSqlBuilder extends SqlBuilder {
	protected placeHolderId = 1;

	public constructor() {
		super();

		this.operators.openEnclosure = '[';
		this.operators.closeEnclosure = ']';
	}

	public appendPlaceholder(): this {
		// mssql uses incrementing placeholders in the format @p1, @p2, ...
		this.sql += `@p${this.placeHolderId} `;
		this.placeHolderId++;

		return this;
	}
}
