import type { BasicStream, Indexed } from "../interfaces.js"
import type { Posed } from "../../Position/interfaces.js"
import type {
	Inputted,
	ReversedStreamClassInstance,
	Copiable,
	Superable
} from "../StreamClass/interfaces.js"

export interface InputStream<Type = any>
	extends BasicStream<Type>,
		Inputted<Indexed>,
		Posed<number>,
		Iterable<Type> {}

export interface EffectiveInputStream<Type = any>
	extends InputStream<Type>,
		Superable,
		Copiable<EffectiveInputStream<Type>>,
		ReversedStreamClassInstance<Type> {}
