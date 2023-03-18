// * largely, just a tiny more intuitive syntax for regexp;

// ? question: should oneself make this a template instead? After all, would want to allow for user's own functions...
// * CURRENT DECISION: yes, let it be so. Do it.
export type RegExpArgs<FlagType = string> = {
	patterns: ((...args: any[]) => boolean)[][]
	flags: FlagType[]
}

// TODO: add more such nice elementary syntax functions; make this stuff far more configurable; separate onto subsubmodules of a submodule `regexp`...
// TODO: add the `flags` option to the functions in question; decide how they should work (for now -- the direct flags, example rea.flags := ["g", "i"])
// * IDEA: self could do new (RegExp((... whatever the wanted string is...), flags.join("")).test(a)); but isn't it a bit tedious? 
// TODO: return back the function that was essentiall (a) => (new RegExp(..., ...).test(a)); s
export function digit(a: string): boolean {
	return /[0-9]/.test(a)
}
export const d = digit

export function word(a: string): boolean {
	return /\w/.test(a)
}
export const w = word

export function backspace(a: string): boolean {
	return /\b/.test(a)
}
export const b = backspace

export function underscore(a: string): boolean {
	return /_/.test(a)
}
export const u = underscore

export function bracket(a: string): boolean {
	return /(\(|\)|\[|\]|\{|\})/.test(a)
}

export function quote(a: string): boolean {
	return /('|")/.test(a)
}
export const q = quote

export function arithmetic(a: string): boolean {
	return /(\+|\-|\*|\/)/.test(a)
}
export const a = arithmetic

export function binary(a: string): boolean {
	return /(\^|\&|\|)/.test(a)
}

// C-like binary shifts
export function cshifts(a: string): boolean {
	return /(\>\>|\<\<)/.test(a)
}
export const s = cshifts

// * Creates a regex-function based on the given RegExpArgs<string> object.
export function regexcreate<FlagType = string>(
	rea: RegExpArgs<FlagType>
): (a: string) => boolean {
	return (a: string): boolean => {
		// TODO: this is "kind of" a problem: currently the function and the type work only for the case when one wants to have a structure that to each symbol would assign possible regex-matching functions;
		// * however, the power of regex is not only in this; it is the capability to do stuff like /.{3, 3}/, which would match any string of length 3; let similar functionality (that is, entirely equivalent to the RegExp and maybe even further, be introduced within these lovely functions...)
		// ? currently, it works in a symbol-mapping mode.
		if (a.length !== rea.patterns.length) return false
		origloop: for (let i = 0; i < a.length; i++) {
			for (const x of rea.patterns[i])
				if (x(a[i], rea.flags)) continue origloop
			return false
		}
		return true
	}
}
export const rc = regexcreate
