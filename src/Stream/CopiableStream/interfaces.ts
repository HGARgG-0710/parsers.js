import type { Summat } from "@hgargg-0710/summat.ts"
import type { BasicStream } from "../BasicStream/interfaces.js"

export interface Copiable<Type = any> extends Summat {
	copy(): Type
}

export interface CopiableStream<Type = any>
	extends BasicStream<Type>,
		Copiable<BasicStream<Type>> {}
