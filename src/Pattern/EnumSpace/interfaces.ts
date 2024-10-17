import type { Copiable } from "src/Stream/StreamClass/interfaces.js"
import type { Sizeable } from "../../IndexMap/interfaces.js"
import type { Pattern } from "../../Pattern/interfaces.js"

export type Mappable<Type = any> = (value: Type, index?: number) => unknown

export interface EnumSpace<Type = any> extends Sizeable, Copiable<EnumSpace<Type>> {
	add: (n: number) => EnumSpace<Type>
	join: (enums: EnumSpace) => EnumSpace<Type>
	map: (f: Mappable<Type>) => unknown[]
}

export interface ConstEnumSpace extends EnumSpace<{}>, Pattern<{}[]> {}
