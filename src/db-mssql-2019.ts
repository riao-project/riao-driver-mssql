import { Database } from 'riao-dbal/src/database';
import { MsSqlDriver } from './driver';
import { DatabaseEnvMsSql } from './env';
import { MsSqlQueryBuilder } from './query-builder';
import { MsSqlDataDefinitionBuilder } from './ddl-builder';
import { MsSqlSchemaQueryRepository } from './schema-query-repository';

export class DatabaseMsSql2019 extends Database {
	driverType = MsSqlDriver;
	envType = DatabaseEnvMsSql;

	ddlBuilderType = MsSqlDataDefinitionBuilder;
	queryBuilderType = MsSqlQueryBuilder;
	schemaQueryRepositoryType = MsSqlSchemaQueryRepository;
}
