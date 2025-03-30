import {
	columnName,
	DatabaseFunctions,
	DatabaseQueryBuilder,
	DatabaseRecord,
	Expression,
	SelectQuery,
} from '@riao/dbal';
import { MsSqlBuilder } from './sql-builder';
import { DatabaseFunction } from '@riao/dbal/functions/function-token';

export class MsSqlQueryBuilder extends DatabaseQueryBuilder {
	public getSqlType() {
		return MsSqlBuilder;
	}

	public select(query: SelectQuery<DatabaseRecord>): this {
		if (query.limit && !query.offset) {
			query['top'] = query.limit;
			delete query.limit;
		}

		return super.select(query);
	}

	public insertOutput(primaryKey: string): this {
		this.sql.append(`OUTPUT INSERTED.[${primaryKey}] AS [${primaryKey}] `);

		return this;
	}

	public selectTop(limit: number): this {
		this.sql.append('TOP ' + limit + ' ');

		return this;
	}

	public pagination(query: SelectQuery): this {
		if (query.offset !== undefined) {
			if (query.orderBy === undefined) {
				throw new Error('Cannot offset without order by!');
			}

			if (!query.limit === undefined) {
				throw new Error('Cannot offset without limit!');
			}

			this.offset(query.offset);
		}

		if (query.limit) {
			this.limit(query.limit);
		}

		return this;
	}

	public offset(nRecords: number): this {
		this.sql.append('OFFSET ' + nRecords + ' ROWS ');

		return this;
	}

	public limit(nRecords: number): this {
		this.sql.append('FETCH NEXT ' + nRecords + ' ROWS ONLY ');

		return this;
	}

	public uuid(): this {
		this.sql.append('NEWID()');

		return this;
	}

	public override date(fn: DatabaseFunction): this {
		this.sql.append('CONVERT(date, ');

		if (fn.params?.expr) {
			this.expression(fn.params.expr);
		}
		else {
			this.expression(DatabaseFunctions.currentTimestamp());
		}

		this.sql.closeParens();

		return this;
	}

	public override getTriggerOld(): string {
		return 'DELETED';
	}

	public override getTriggerNew(): string {
		return 'INSERTED';
	}

	public override triggerSetValue(options: {
		table: string;
		idColumn: string;
		column: string;
		value: Expression;
	}): this {
		const key = options.idColumn;

		return this.update({
			table: options.table,
			set: { [options.column]: options.value },
			from: { NEW: this.getTriggerNew() },
			where: { [`${options.table}.${key}`]: columnName('NEW.' + key) },
		});
	}
}
