import type { Copiable } from "src/interfaces.js"
import type { Sizeable } from "src/interfaces.js"
import type { Mappable } from "../interfaces.js"

export interface EnumSpace<Type = any> extends Sizeable, Copiable<EnumSpace<Type>> {
	add: (n: number) => this
	join: (enums: EnumSpace<Type>) => this
	map: <F extends Mappable<Type> = Mappable<Type>>(f?: F) => ReturnType<F>[]
}

export interface ArrayEnum<Type = any> extends EnumSpace<Type> {
	get: () => readonly Type[]
}
