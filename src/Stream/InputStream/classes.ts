import type { IFreezableSequence } from "../../interfaces.js"
import { StreamClass } from "../StreamClass/classes.js"
import type { IConcreteInputStream } from "./interfaces.js"
import { methods } from "./methods.js"

export const InputStream = StreamClass({
	...methods,
	hasPosition: true,
	hasBuffer: true
}) as new <Type = any>(
	buffer?: IFreezableSequence<Type>
) => IConcreteInputStream<Type>
