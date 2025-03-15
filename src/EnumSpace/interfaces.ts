import type { Copiable } from "src/interfaces.js"
import type { Sizeable } from "src/interfaces.js"
import type { Mappable } from "../interfaces.js"

export interface IEnumSpace<Type = any> extends Sizeable, Copiable<IEnumSpace<Type>> {
	add: (n: number) => this
	join: (enums: IEnumSpace<Type>) => this
	map: <Out = any>(f?: Mappable<Type, Out>) => Out[]
}
