import { Database } from 'riao-dbal/src/database';
import { MsSql2017Driver } from './driver-mssql-2017';
import { DatabaseEnvMsSql2017 } from './env-mssql-2017';

export class DatabaseMsSql2017 extends Database {
	driverType = MsSql2017Driver;
	envType = DatabaseEnvMsSql2017;
}
