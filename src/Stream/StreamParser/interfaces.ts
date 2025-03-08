import type {
	EndableStream,
	Stateful,
	StreamClassInstance
} from "../../Stream/StreamClass/interfaces.js"

import type { StreamHandler } from "../../Parser/TableMap/interfaces.js"
import type { Supered } from "src/interfaces.js"
import type { Pattern } from "../../Pattern/interfaces.js"
import type { Posed } from "../../Position/interfaces.js"
import type { Bufferized } from "../../Collection/Buffer/interfaces.js"

export interface IStreamParser<InType = any, OutType = any>
	extends Pattern<EndableStream<InType>>,
		StreamClassInstance<OutType>,
		Supered,
		Partial<Posed<number>>,
		Partial<Bufferized<OutType>>,
		Partial<Stateful> {
	handler: StreamHandler<OutType>
}
