import type { Copiable } from "src/IndexMap/interfaces.js"
import type { Sizeable } from "../IndexMap/interfaces.js"

export type Mappable<Type = any> = (value: Type, index?: number) => unknown

export interface EnumSpace<Type = any> extends Sizeable, Copiable<EnumSpace<Type>> {
	add: (n: number) => this
	join: (enums: EnumSpace<Type>) => this
	map: (f?: Mappable<Type>) => unknown[]
}

export interface ArrayEnum<Type = any> extends EnumSpace<Type> {
	get: () => readonly Type[]
}
