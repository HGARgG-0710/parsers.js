// * largely, just a tiny more intuitive syntax for regexp;
// TODO: add more such nice syntax functions; make this stuff far more configurable; separate onto subsubmodules of a submodule `regexp`...
export function digit(a: string): boolean {
	return /[0-9]/.test(a)
}
export const d = digit

export function word(a: string): boolean {
	return /\w/.test(a)
}
export const w = word

export function backspace(a: string) {
	return /\b/.test(a)
}
export const b = backspace

export function underscore(a: string): boolean {
	return /_/.test(a)
}
export const u = underscore

export function bracket(a: string) {
	return /(\(|\)|\[|\]|\{|\})/.test(a)
}

export function quote(a: string) {
	return /('|")/.test(a)
}
export const q = quote

export function regtest(a: string, regular: string, flags: string) {
	return new RegExp(regular, flags).test(a)
}
export const rt = regtest
