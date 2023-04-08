import { DatabaseQueryBuilder } from 'riao-dbal/src';
import { num2str } from './param';

export class MsSqlQueryBuilder extends DatabaseQueryBuilder {
	protected placeHolderId = 1;

	public appendPlaceholder(): this {
		// postgres uses incrementing placeholders in the format @p1, @p2, ...
		this.sql += `@p${num2str(this.placeHolderId)} `;
		this.placeHolderId++;

		return this;
	}
}
