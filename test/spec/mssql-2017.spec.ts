import 'jasmine';
import { DatabaseMsSql2017 } from '../../src';
import { connectionOptionsMsSql2017 } from '../connection-options';
import { test } from 'riao-driver-test/src';
import { env } from '../env';

test({
	name: 'MsSQL 2017',
	db: DatabaseMsSql2017,
	expectedVersion: /^14\.0\.[0-9]+\.[0-9]+$/,
	connectionOptions: connectionOptionsMsSql2017,
	rootUsername: env.TEST_MSSQL2017_ROOT_USERNAME,
	rootPassword: env.TEST_MSSQL2017_ROOT_PASSWORD,
	rootDatabase: env.TEST_MSSQL2017_ROOT_DATABASE,
});
