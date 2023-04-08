import { AppConfig, configure } from 'ts-appconfig';

/**
 * Environment Variables Schema
 */
export class Environment extends AppConfig {
	readonly APP_TITLE = 'typescript-template-library';

	readonly TEST_MSSQL2017_HOST = 'localhost';
	readonly TEST_MSSQL2017_PORT = 1433;
	readonly TEST_MSSQL2017_USERNAME = 'riao';
	readonly TEST_MSSQL2017_PASSWORD = 'password1234';
	readonly TEST_MSSQL2017_DATABASE = 'riao';

	readonly TEST_MSSQL2019_HOST = 'localhost';
	readonly TEST_MSSQL2019_PORT = 1453;
	readonly TEST_MSSQL2019_USERNAME = 'riao';
	readonly TEST_MSSQL2019_PASSWORD = 'password1234';
	readonly TEST_MSSQL2019_DATABASE = 'riao';
}

/**
 * Load & export environment variables
 */
export const env: Environment = configure(Environment);
