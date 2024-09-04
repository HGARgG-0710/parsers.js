import type { Indexed } from "../interfaces.js"
import type {
	PositionalStream,
	NavigableStream,
	ReversibleStream,
	RewindableStream
} from "_src/types.js"
import type {
	BaseNextable,
	BasePrevable,
	IsEndCurrable,
	IsStartCurrable,
	Inputted
} from "../interfaces.js"
import type { CopiableStream } from "../CopiableStream/interfaces.js"
import type { FinishableStream } from "../FinishableStream/interfaces.js"
import type { IterableStream } from "../IterableStream/interfaces.js"

export interface InputStream<Type = any>
	extends PositionalStream<Type, number>,
		IterableStream<Type>,
		NavigableStream<Type>,
		ReversibleStream<Type>,
		RewindableStream<Type>,
		CopiableStream<Type>,
		FinishableStream<Type>,
		Inputted<Indexed>,
		BaseNextable<Type>,
		BasePrevable<Type>,
		IsEndCurrable,
		IsStartCurrable {}
