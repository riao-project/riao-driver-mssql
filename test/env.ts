import { AppConfig, configure } from 'ts-appconfig';

/**
 * Environment Variables Schema
 */
export class Environment extends AppConfig {
	readonly APP_TITLE = 'typescript-template-library';

	readonly TEST_MSSQL2017_HOST = 'localhost';
	readonly TEST_MSSQL2017_PORT = 1433;
	readonly TEST_MSSQL2017_USERNAME = 'SA';
	readonly TEST_MSSQL2017_PASSWORD = 'Rootpassword!234';
	readonly TEST_MSSQL2017_DATABASE = 'riaodb';
	readonly TEST_MSSQL2017_ROOT_DATABASE = '';

	readonly TEST_MSSQL2019_HOST = 'localhost';
	readonly TEST_MSSQL2019_PORT = 1434;
	readonly TEST_MSSQL2019_USERNAME = 'SA';
	readonly TEST_MSSQL2019_PASSWORD = 'Rootpassword!234';
	readonly TEST_MSSQL2019_DATABASE = 'riaodb';
	readonly TEST_MSSQL2019_ROOT_DATABASE = '';

	readonly TEST_MSSQL2022_HOST = 'localhost';
	readonly TEST_MSSQL2022_PORT = 1435;
	readonly TEST_MSSQL2022_USERNAME = 'SA';
	readonly TEST_MSSQL2022_PASSWORD = 'Rootpassword!234';
	readonly TEST_MSSQL2022_DATABASE = 'riaodb';
	readonly TEST_MSSQL2022_ROOT_DATABASE = '';
}

/**
 * Load & export environment variables
 */
export const env: Environment = configure(Environment);
