import type { Summat } from "@hgargg-0710/summat.ts"
import type { Sizeable } from "../../IndexMap/interfaces.js"
import type { Pattern } from "../../Pattern/interfaces.js"

export type Mappable<Type = any> = (value: Type, index?: number) => unknown

export interface EnumSpace<Type = any> extends Summat, Sizeable {
	add: (n: number) => EnumSpace<Type>
	join: (enums: EnumSpace) => EnumSpace<Type>
	copy: () => EnumSpace<Type>
	map: (f: Mappable<Type>) => unknown[]
}

export interface ConstEnumSpace extends EnumSpace<{}>, Pattern<{}[]> {}
