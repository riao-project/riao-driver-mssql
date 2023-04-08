import 'jasmine';
import { MsSql2019Driver } from '../../src';
import { connectionOptionsMsSql2019 } from '../connection-options';
import { test } from 'riao-driver-test/src';

test({
	name: 'MsSQL 2019',
	driver: MsSql2019Driver,
	expectedVersion: /^15\.0\.[0-9]+\.[0-9]+$/,
	connectionOptions: connectionOptionsMsSql2019,
});
