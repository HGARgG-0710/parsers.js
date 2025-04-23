import type { ICopiable, IMappable, ISizeable } from "../interfaces.js"

export interface IEnumSpace<Type = any> extends ISizeable, ICopiable {
	add: (n: number) => this
	join: (enums: IEnumSpace<Type>) => this
	map: <Out = any>(f?: IMappable<Type, Out>) => Out[]
}
