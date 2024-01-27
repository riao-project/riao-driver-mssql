import { SqlBuilder } from '@riao/dbal/builder';

export class MsSqlBuilder extends SqlBuilder {
	protected placeHolderId = 1;

	public constructor() {
		super();

		this.operators.openEnclosure = '[';
		this.operators.closeEnclosure = ']';
	}

	public appendPlaceholder(value: any): this {
		// mssql uses incrementing placeholders in the format @p1, @p2, ...
		if (typeof value === 'number' && !Number.isInteger(value)) {
			// Selecting decimal math in mssql driver will return an int in mssql
			//	unless you cast input params to decimal
			const [significant, precision] = `${value}`
				.split('.')
				.map((v) => v.length);

			this.sql += `CAST(@p${this.placeHolderId} AS numeric(${
				significant + precision
			},${precision})) `;
		}
		else if (typeof value === 'number') {
			// Selecting decimal math in mssql driver will return an int in mssql
			//	unless you cast input params to decimal
			const significant = `${value}`.length;
			const precision = 2;

			this.sql += `CAST(@p${this.placeHolderId} AS numeric(${
				significant + precision
			},${precision})) `;
		}
		else {
			this.sql += `@p${this.placeHolderId} `;
		}

		this.placeHolderId++;

		return this;
	}
}
