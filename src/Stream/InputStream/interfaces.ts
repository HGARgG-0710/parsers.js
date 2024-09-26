import type { Indexed } from "../interfaces.js"
import type { PositionalStream } from "../PositionalStream/interfaces.js"
import type { Inputted } from "../UnderStream/interfaces.js"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { CopiableStream } from "../CopiableStream/interfaces.js"
import type { IterableStream } from "../IterableStream/interfaces.js"

export interface InputStream<Type = any>
	extends Inputted<Indexed>,
		PositionalStream<Type, number>,
		IterableStream<Type> {}

export interface EffectiveInputStream<Type = any>
	extends InputStream<Type>,
		CopiableStream<Type>,
		ReversedStreamClassInstance<Type> {}
