import type { BasicStream, Indexed } from "../interfaces.js"
import type { Posed } from "../PositionalStream/interfaces.js"
import type { Inputted } from "../UnderStream/interfaces.js"
import type { ReversedStreamClassInstance } from "../StreamClass/interfaces.js"
import type { Copiable } from "../StreamClass/Copiable/interfaces.js"
import type { Superable } from "src/Stream/StreamClass/Superable/interfaces.js"

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
