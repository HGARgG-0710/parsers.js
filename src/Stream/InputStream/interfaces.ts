import type { Bufferized } from "../../Collection/Buffer/interfaces.js"
import type { Posed } from "../../Position/interfaces.js"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { Supered } from "src/interfaces.js"

export type IInputStream<Type = any> = Supered &
	ReversedStreamClassInstance<Type> &
	Posed<number> &
	Bufferized<Type>
