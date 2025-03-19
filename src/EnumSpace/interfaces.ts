import type { ICopiable, ISizeable, IMappable } from "../interfaces.js"

export interface IEnumSpace<Type = any>
	extends ISizeable,
		ICopiable<IEnumSpace<Type>> {
	add: (n: number) => this
	join: (enums: IEnumSpace<Type>) => this
	map: <Out = any>(f?: IMappable<Type, Out>) => Out[]
}
