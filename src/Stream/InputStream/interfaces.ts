import type { BasicStream, Indexed } from "../interfaces.js"
import type {
	Inputted,
	ReversedStreamClassInstance,
	Superable
} from "../StreamClass/interfaces.js"

export interface InputStream<Type = any> extends BasicStream<Type>, Inputted<Indexed> {}

export interface EffectiveInputStream<Type = any>
	extends InputStream<Type>,
		Superable,
		ReversedStreamClassInstance<Type> {}
