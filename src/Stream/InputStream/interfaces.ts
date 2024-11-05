import type {
	BufferizedReversedStreamClassInstance,
	PositionalReversedStreamClassInstance,
	Superable
} from "../StreamClass/interfaces.js"

export interface InputStream<Type = any>
	extends Superable,
		PositionalReversedStreamClassInstance<Type>,
		BufferizedReversedStreamClassInstance<Type> {}
