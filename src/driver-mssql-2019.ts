import { MsSql2019DataDefinitionBuilder } from './ddl-builder-mssql-2019';
import { MsSql2017Driver } from './driver-mssql-2017';
import { MsSql2019QueryBuilder } from './query-builder-mssql-2019';

export class MsSql2019Driver extends MsSql2017Driver {
	dataDefinitionBuilder = MsSql2019DataDefinitionBuilder;
	queryBuilder = MsSql2019QueryBuilder;
}
