import { MsSql2017DataDefinitionBuilder } from './ddl-builder-mssql-2017';
import { MsSqlDriver } from './driver';
import { MsSql2017QueryBuilder } from './query-builder-mssql-2017';
import { MsSql2017SchemaQueryRepository } from './schema-query-repository-mssql-2017';

export class MsSql2017Driver extends MsSqlDriver {
	dataDefinitionBuilder = MsSql2017DataDefinitionBuilder;
	queryBuilder = MsSql2017QueryBuilder;
	schemaQueryRepository = MsSql2017SchemaQueryRepository;
}
