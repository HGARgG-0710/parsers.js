import type { FreezableBuffer } from "../../Collection/Buffer/interfaces.js"
import type { IInputStream } from "./interfaces.js"

import { StreamClass } from "../StreamClass/abstract.js"
import { methods } from "./refactor.js"

export const InputStream = StreamClass({
	...methods,
	hasPosition: true,
	buffer: true
}) as new <Type = any>(buffer?: FreezableBuffer<Type>) => IInputStream<Type>
