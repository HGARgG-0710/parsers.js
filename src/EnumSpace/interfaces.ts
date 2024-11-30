import type { Copiable } from "../Stream/StreamClass/interfaces.js"
import type { Sizeable } from "../IndexMap/interfaces.js"

export type Mappable<Type = any> = (value: Type, index?: number) => unknown

export interface EnumSpace<Type = any> extends Sizeable, Copiable<EnumSpace<Type>> {
	add: (n: number) => EnumSpace<Type>
	join: (enums: EnumSpace<Type>) => EnumSpace<Type>
	map: (f?: Mappable<Type>) => unknown[]
}

export interface ArrayEnum<Type = any> extends EnumSpace<Type> {
	get: () => readonly Type[]
}
