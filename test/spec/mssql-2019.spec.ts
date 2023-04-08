import 'jasmine';
import { DatabaseMsSql2019 } from '../../src';
import { connectionOptionsMsSql2019 } from '../connection-options';
import { test } from 'riao-driver-test/src';

test({
	name: 'MsSQL 2019',
	db: DatabaseMsSql2019,
	expectedVersion: /^15\.0\.[0-9]+\.[0-9]+$/,
	connectionOptions: connectionOptionsMsSql2019,
});
