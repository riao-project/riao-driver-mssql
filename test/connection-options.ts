import { MsSqlConnectionOptions } from '../src';
import { env } from './env';

export const connectionOptionsMsSql2017: MsSqlConnectionOptions = {
	host: env.TEST_MSSQL2017_HOST,
	port: env.TEST_MSSQL2017_PORT,
	database: env.TEST_MSSQL2017_DATABASE,
	username: env.TEST_MSSQL2017_USERNAME,
	password: env.TEST_MSSQL2017_PASSWORD,
};

export const connectionOptionsMsSql2019: MsSqlConnectionOptions = {
	host: env.TEST_MSSQL2019_HOST,
	port: env.TEST_MSSQL2019_PORT,
	database: env.TEST_MSSQL2019_DATABASE,
	username: env.TEST_MSSQL2019_USERNAME,
	password: env.TEST_MSSQL2019_PASSWORD,
};
