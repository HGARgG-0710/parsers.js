import type {
	EndableStream,
	OptStateful,
	StreamClassInstance
} from "../../Stream/StreamClass/interfaces.js"
import type { StreamHandler } from "../../Parser/TableMap/interfaces.js"
import type { Superable } from "../../Stream/StreamClass/interfaces.js"
import type { Pattern } from "../../Pattern/interfaces.js"
import type { OptPosed } from "../../Position/interfaces.js"
import type { OptBufferized } from "../../Collection/Buffer/interfaces.js"

export interface StreamParser<InType = any, OutType = any>
	extends Pattern<EndableStream<InType>>,
		StreamClassInstance<OutType>,
		Superable,
		OptPosed<number>,
		OptBufferized<OutType>,
		OptStateful {
	handler: StreamHandler<OutType>
}
