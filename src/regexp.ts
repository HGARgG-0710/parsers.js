// * largely, just a tiny more intuitive syntax for regexp;

export type RegExpArgs<FlagType = string> = {
	patterns: ((...args: any[]) => boolean)[][]
	flags: FlagType[][][]
}

export function digit(a: string = "", flags: string[] = []): boolean {
	return regexp(a, "/\\d/", flags)
}
export const d = digit

export function word(a: string = "", flags: string[] = []): boolean {
	return regexp(a, "/\\w/", flags)
}
export const w = word

export function backspace(a: string = "", flags: string[] = []): boolean {
	return regexp(a, "/\\b/", flags)
}
export const b = backspace

export function underscore(a: string = "", flags: string[] = []): boolean {
	return regexp(a, "/_/", flags)
}
export const u = underscore

export function bracket(a: string = "", flags: string[] = []): boolean {
	return regexp(a, "/(\\(|\\)|\\[|\\]|\\{|\\})/", flags)
}

export function quote(a: string = "", flags: string[] = []): boolean {
	return regexp(a, "/(\"|')/", flags)
}
export const q = quote

export function arithmetic(a: string = "", flags: string[] = []): boolean {
	return regexp(a, "/(\\+|\\-|\\*|\\/)", flags)
}
export const a = arithmetic

export function binary(a: string = "", flags: string[] = []): boolean {
	return regexp(a, "/(\\^|\\&|\\|)/", flags)
}

// C-like binary shifts
export function cshifts(a: string = "", flags: string[] = []): boolean {
	return regexp(a, "/(>>|<<)/", flags)
}
export const s = cshifts

// * matches >=, <=, >, <...
export function comparison(a: string = "", flags: string[] = []): boolean {
	return regexp(a, "/((>|<){1,1}={0,1})/", flags)
}

export function regexp(s: string, expression: string, flags: string[] = []) {
	return new RegExp(expression, flags.join("")).test(s)
}

// * Creates a regex-function based on the given RegExpArgs<string> object.
export function regexcreate<FlagType = string>(
	rea: RegExpArgs<FlagType>
): (a: string) => boolean {
	return (a: string): boolean => {
		// TODO: this is "kind of" a problem: currently the function and the type work only for the case when one wants to have a structure that to each symbol would assign possible regex-matching functions;
		// * however, the power of regex is not only in this; it is the capability to do stuff like /.{3, 3}/, which would match any string of length 3; let similar functionality (that is, entirely equivalent to the RegExp and maybe even further, be introduced within these lovely functions...)
		// ? currently, it works in a symbol-mapping mode.
		// * IDEA 1: decide upon "mods": let the entire object's patterns be separated onto segments that have "mods": "map" and "surjective"; "map" is the currently defined one, whilst "surjective" would allow for beautiful stuff like /.?/ (any string at all);
		// ! There is still a problem with this particular solution: what about the matter of fact that the RegExp matches not only strings that are matching entirely but also those, whose segments match? It's not a matter of actually using it, rather than the funcitonality that it brings with itself. That should not disappear...
		if (a.length !== rea.patterns.length) return false
		origloop: for (let i = 0; i < a.length; i++) {
			let j = 0
			for (const x of rea.patterns[i]) {
				if (x(a[i], rea.flags[i][j])) continue origloop
				j++
			}
			return false
		}
		return true
	}
}
export const rc = regexcreate
