import type { Summat } from "@hgargg-0710/summat.ts"
import type { Pattern } from "src/Pattern/interfaces.js"

export type Mappable<Type = any> = (value: Type, index: number) => unknown

export interface EnumSpace<Type = any> extends Summat {
	add(n: number): EnumSpace<Type>
	join(enums: EnumSpace): EnumSpace<Type>
	copy(): EnumSpace<Type>
	map(f: Mappable<Type>): unknown[]
	size: number
}

export interface ConstEnumSpace extends EnumSpace<{}>, Pattern<{}[]> {}
export interface IncrementEnum extends EnumSpace<number> {}
