import type { Summat } from "main.js"

export interface PreBasicStream<Type = any> extends Summat {
	curr(this: PreBasicStream<Type>): Type
	next(this: PreBasicStream<Type>): Type
}

export interface BasicStream<Type = any> extends PreBasicStream<Type> {
	isEnd: boolean
}

export interface Inputted<Type = any> extends Summat {
	input: Type
}
