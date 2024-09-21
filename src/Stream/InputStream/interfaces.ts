import type { Indexed } from "../interfaces.js"
import type { PositionalStream } from "../PositionalStream/interfaces.js"
import type { NavigableStream } from "../NavigableStream/interfaces.js"
import type { RewindableStream } from "../RewindableStream/interfaces.js"
import type { Inputted } from "../UnderStream/interfaces.js"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { CopiableStream } from "../CopiableStream/interfaces.js"
import type { FinishableStream } from "../FinishableStream/interfaces.js"
import type { IterableStream } from "../IterableStream/interfaces.js"

export interface InputStream<Type = any>
	extends Inputted<Indexed>,
		PositionalStream<Type, number>,
		IterableStream<Type> {}

export interface EffectiveInputStream<Type = any>
	extends InputStream<Type>,
		NavigableStream<Type>,
		RewindableStream<Type>,
		CopiableStream<Type>,
		FinishableStream<Type>,
		ReversedStreamClassInstance<Type> {}
