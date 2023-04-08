import 'jasmine';
import { MsSql2017Driver } from '../../src';
import { connectionOptionsMsSql2017 } from '../connection-options';
import { test } from 'riao-driver-test/src';

test({
	name: 'MsSQL 2017',
	driver: MsSql2017Driver,
	expectedVersion: /^14\.0\.[0-9]+\.[0-9]+$/,
	connectionOptions: connectionOptionsMsSql2017,
});
