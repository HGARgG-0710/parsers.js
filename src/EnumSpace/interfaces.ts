import type { Copiable } from "src/interfaces.js"
import type { Sizeable } from "src/interfaces.js"
import type { Mappable } from "../interfaces.js"
import type { GettablePattern } from "../Pattern/interfaces.js"

export interface EnumSpace<Type = any> extends Sizeable, Copiable<EnumSpace<Type>> {
	add: (n: number) => this
	join: (enums: EnumSpace<Type>) => this
	map: <Out = any>(f?: Mappable<Type, Out>) => Out[]
}

export interface ArrayEnum<Type = any>
	extends EnumSpace<Type>,
		GettablePattern<readonly Type[]> {}
