import 'jasmine';
import { DatabaseMsSql2019 } from '../../src';
import { connectionOptionsMsSql2019 } from '../connection-options';
import { test } from 'riao-driver-test/src';
import { env } from '../env';

test({
	name: 'MsSQL 2019',
	db: DatabaseMsSql2019,
	expectedVersion: /^15\.0\.[0-9]+\.[0-9]+$/,
	connectionOptions: connectionOptionsMsSql2019,
	rootUsername: env.TEST_MSSQL2019_ROOT_USERNAME,
	rootPassword: env.TEST_MSSQL2019_ROOT_PASSWORD,
	rootDatabase: env.TEST_MSSQL2019_ROOT_DATABASE,
});
