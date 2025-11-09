import type { IOwnedStream, IRawStreamArray } from "../../interfaces.js"
import { TableHandler } from "../../objects.js"
import { CurrentHash } from "../../objects/HashMap.js"
import { BasicMap } from "../../samples/TerminalMap.js"
import { maybeCharClass } from "./CharClass.js"
import { maybeDot } from "./Dot.js"
import { maybeEscaped } from "./Escaped.js"
import { maybeGroup } from "./Group.js"
import { maybeNegation } from "./Negation.js"
import { maybePipe } from "./Pipe.js"
import { maybePreQuantifier } from "./Quantifiers/Pre.js"
import { HandleSingleChar } from "./SingleChar.js"
import { maybeTypeMatch } from "./TypeMatch.js"

export const RegexTokenizer = TableHandler<
	IOwnedStream<string>,
	IRawStreamArray
>(
	new CurrentHash(
		BasicMap(
			[
				...maybeEscaped,
				...maybeNegation,
				...maybeTypeMatch,
				...maybeGroup,
				...maybeCharClass,
				...maybeDot,
				...maybePreQuantifier,
				...maybePipe
			],
			HandleSingleChar
		)
	)
)
