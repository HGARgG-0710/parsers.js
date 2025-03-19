import type {
	IEndableStream,
	IStateful,
	IStreamClassInstance
} from "../../Stream/StreamClass/interfaces.js"

import type { IStreamHandler } from "../../Parser/TableMap/interfaces.js"
import type { ISupered } from "../../interfaces.js"
import type { IPattern } from "../../Pattern/interfaces.js"
import type { IPosed } from "../../Position/interfaces.js"
import type { IBufferized } from "../../Collection/Buffer/interfaces.js"

export interface IStreamParser<InType = any, OutType = any>
	extends IPattern<IEndableStream<InType>>,
		IStreamClassInstance<OutType>,
		ISupered,
		Partial<IPosed<number>>,
		Partial<IBufferized<OutType>>,
		Partial<IStateful> {
	handler: IStreamHandler<OutType>
}
