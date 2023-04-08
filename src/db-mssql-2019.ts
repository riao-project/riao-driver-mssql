import { Database } from 'riao-dbal/src/database';
import { MsSql2019Driver } from './driver-mssql-2019';
import { DatabaseEnvMsSql2019 } from './env-mssql-2019';

export class DatabaseMsSql2019 extends Database {
	driverType = MsSql2019Driver;
	envType = DatabaseEnvMsSql2019;
}
