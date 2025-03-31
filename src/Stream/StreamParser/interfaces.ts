import type { IStreamClassInstance } from "../../Stream/StreamClass/interfaces.js"
import type { IEndableStream } from "../interfaces.js"
import type { IStateful } from "src/interfaces.js"

import type { IStreamHandler } from "../../TableMap/interfaces.js"
import type { ISupered } from "../../interfaces.js"
import type { IPattern } from "src/interfaces.js"

export type IStreamParser<InType = any, OutType = any> = IPattern<
	IEndableStream<InType>
> &
	IStreamClassInstance<OutType> &
	ISupered &
	Partial<IStateful> & {
		handler: IStreamHandler<OutType>
	}
