import 'jasmine';
import { MsSqlQueryBuilder } from '../src/query-builder';

describe('MsSqlQueryBuilder', () => {
	describe('select', () => {
		it('uses TOP when limit is set without offset', () => {
			const builder = new MsSqlQueryBuilder();
			builder.select({ columns: ['*'], table: 'users', limit: 10 });
			const { sql } = builder.toDatabaseQuery();

			expect(sql).toContain('TOP 10');
			expect(sql).not.toContain('OFFSET');
			expect(sql).not.toContain('FETCH NEXT');
		});

		it('uses OFFSET/FETCH when offset is 0', () => {
			const builder = new MsSqlQueryBuilder();
			builder.select({
				columns: ['*'],
				table: 'users',
				limit: 10,
				offset: 0,
				orderBy: { id: 'ASC' },
			});
			const { sql } = builder.toDatabaseQuery();

			expect(sql).not.toContain('TOP');
			expect(sql).toContain('OFFSET 0 ROWS');
			expect(sql).toContain('FETCH NEXT 10 ROWS ONLY');
		});

		it('uses OFFSET/FETCH when offset is greater than 0', () => {
			const builder = new MsSqlQueryBuilder();
			builder.select({
				columns: ['*'],
				table: 'users',
				limit: 10,
				offset: 20,
				orderBy: { id: 'ASC' },
			});
			const { sql } = builder.toDatabaseQuery();

			expect(sql).not.toContain('TOP');
			expect(sql).toContain('OFFSET 20 ROWS');
			expect(sql).toContain('FETCH NEXT 10 ROWS ONLY');
		});
	});
});
