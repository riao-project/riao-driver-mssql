import { ColumnOptions, DataDefinitionBuilder } from 'riao-dbal/src';

export class MsSqlDataDefinitionBuilder extends DataDefinitionBuilder {
	public getAutoIncrement(): string {
		return 'IDENTITY';
	}
}
