import type { Summat } from "@hgargg-0710/summat.ts"

export interface BasicStream<Type = any>
	extends Endable,
		Currable<Type>,
		Nextable<Type> {}

export interface Nextable<Type = any> extends Summat {
	next: () => Type
}

export interface Currable<Type = any> extends Summat {
	curr: Type
}

export interface Endable extends Summat {
	isEnd: boolean
}
