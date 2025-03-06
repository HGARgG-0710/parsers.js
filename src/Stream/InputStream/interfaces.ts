import type { Bufferized } from "../../Collection/Buffer/interfaces.js"
import type { Posed } from "../../Position/interfaces.js"
import type { ReversedStreamClassInstance, Superable } from "../StreamClass/interfaces.js"

export type IInputStream<Type = any> = Superable &
	ReversedStreamClassInstance<Type> &
	Posed<number> &
	Bufferized<Type>
