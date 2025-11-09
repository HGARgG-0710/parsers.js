import { TableHandler } from "../../objects.js"
import { PreserveLowerStream } from "./Parser.js"
import { maybePlus } from "./Quantifiers/Plus.js"
import { maybeQMark } from "./Quantifiers/QMark.js"
import { maybeRange } from "./Quantifiers/Range.js"
import { maybeStar } from "./Quantifiers/Star.js"
import { LookaheadMap } from "./Utils/LookaheadMap.js"

export const QuantifierProcessor = TableHandler(
	LookaheadMap(
		[...maybePlus, ...maybeQMark, ...maybeStar, ...maybeRange],
		PreserveLowerStream
	)
)
