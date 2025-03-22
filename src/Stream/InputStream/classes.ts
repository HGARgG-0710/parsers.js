import type { IFreezableBuffer } from "../../Collection/Buffer/interfaces.js"
import type { IInputStream } from "./interfaces.js"

import { StreamClass } from "../StreamClass/abstract.js"
import { methods } from "./refactor.js"

export const InputStream = StreamClass({
	...methods,
	hasPosition: true,
	hasBuffer: true
}) as new <Type = any>(buffer?: IFreezableBuffer<Type>) => IInputStream<Type>
