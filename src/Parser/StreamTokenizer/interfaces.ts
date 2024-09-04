import type { StartedStream } from "main.js"
import type { Inputted, BaseNextable, IsEndCurrable } from "../../Stream/interfaces.js"
import type { BasicStream } from "src/Stream/BasicStream/interfaces.js"
import type { StreamMap } from "../ParserMap/interfaces.js"

export interface StreamTokenizer<OutType = any>
	extends Inputted<BasicStream>,
		StartedStream<OutType>,
		BaseNextable<OutType>,
		IsEndCurrable {
	tokenMap: StreamMap<OutType>
}
