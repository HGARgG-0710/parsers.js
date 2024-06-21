import type { Summat } from "./Summat.js"
import type { Token } from "./Token.js"

export interface Source<Type = any> extends Concattable<Source<Type>>, Summat {
	value: Type
}

export interface Concattable<Type = any> extends Summat {
	concat: (x: Type) => Concattable<Type>
}

export function StringSource(string: string = ""): Source<string> {
	return {
		value: string,
		concat: function (source) {
			return StringSource(string + source.value)
		}
	}
}
StringSource.empty = StringSource()

export function TokenSource<Type = any>(
	token: Token<Type, Concattable>
): Source<Token<Type, Concattable>> {
	return {
		value: token,
		concat: (plus: Source) =>
			TokenSource({ ...token, value: token.value.concat(plus.value) })
	}
}
