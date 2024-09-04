import type { Summat } from "@hgargg-0710/summat.ts"
import type { Pattern } from "../interfaces.js"

export interface Token<Type = any, Value = any>
	extends TokenInstance<Type>,
		Pattern<Value> {}

export interface TokenInstance<Type = any> extends Summat {
	type: Type
}

export interface TokenInstanceClass<Type = any> extends Summat {
	(): TokenInstance<Type>
	is: (x: any) => x is TokenInstance<Type>
}

export interface TokenType<Type = any, Value = any> extends Summat {
	(value: Value): Token<Type, Value>
	is: (x: any) => x is TokenInstance<Type>
}
