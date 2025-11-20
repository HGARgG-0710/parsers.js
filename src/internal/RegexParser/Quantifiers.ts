import { TableHandler } from "../../objects.js"
import { IdentityStream } from "../../objects/Stream.js"
import { maybePlus } from "./Quantifiers/Plus.js"
import { maybeQMark } from "./Quantifiers/QMark.js"
import { maybeRange } from "./Quantifiers/Range.js"
import { maybeStar } from "./Quantifiers/Star.js"
import { LookaheadMap } from "./Utils/LookaheadMap.js"

const PreserveLowerStream = () => new IdentityStream()

export const QuantifierProcessor = TableHandler(
	LookaheadMap(
		[...maybePlus, ...maybeQMark, ...maybeStar, ...maybeRange],
		PreserveLowerStream
	)
)
