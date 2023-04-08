import 'jasmine';

import { num2str } from '../../../src/param';

describe('num2str', () => {
	it('can convert to a', () => {
		expect(num2str(0)).toEqual('a');
	});

	it('can convert to b', () => {
		expect(num2str(1)).toEqual('b');
	});

	it('can convert to ba', () => {
		expect(num2str(10)).toEqual('ba');
	});

	it('can convert to fff', () => {
		expect(num2str(555)).toEqual('fff');
	});
});
