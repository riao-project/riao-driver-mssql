import 'jasmine';
import { DatabaseMsSql2022 } from '../../src/db-mssql-2022';
import { connectionOptionsMsSql2022 } from '../connection-options';
import { test } from '@riao/driver-test';
import { env } from '../env';

test({
	name: 'MsSQL 2022',
	db: DatabaseMsSql2022,
	expectedVersion: /^16\.0\.[0-9]+\.[0-9]+$/,
	connectionOptions: connectionOptionsMsSql2022,
	rootDatabase: env.TEST_MSSQL2022_ROOT_DATABASE,
});
