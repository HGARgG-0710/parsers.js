import type { IBufferized } from "../../Collection/Buffer/interfaces.js"
import type { IPosed } from "../../Position/interfaces.js"
import type { IReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { ISupered } from "../../interfaces.js"

export type IInputStream<Type = any> = ISupered &
	IReversedStreamClassInstance<Type> &
	IPosed<number> &
	IBufferized<Type>
