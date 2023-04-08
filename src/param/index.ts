export function getLetter(num: number): string {
	return String.fromCharCode(97 + num);
}

export function num2str(num: number): string {
	return Array.from('' + num)
		.map((l) => getLetter(parseInt(l, 10)))
		.join('');
}
