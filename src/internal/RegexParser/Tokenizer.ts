import type { Regex } from "../../objects.js"
import { maybeCharClass } from "./Class/CharClass.js"
import { maybeDot } from "./Dot.js"
import { maybeEscaped } from "./Escaped.js"
import { maybeGroup } from "./Group.js"
import { maybeNegation } from "./Negation.js"
import { maybePipe } from "./Pipe.js"
import { maybePreQuantifier } from "./Quantifiers/Pre.js"
import { HandleSingleChar } from "./SingleChar.js"
import { maybeTypeMatch } from "./TypeMatch.js"
import { CurrCharHandler } from "./Utils/CurrCharHandler.js"

export function RegexTokenizer(extensions: Regex.Extension[]) {
	return CurrCharHandler(
		{
			...maybeEscaped,
			...maybeNegation,
			...maybeTypeMatch,
			...maybeGroup(extensions),
			...maybeCharClass,
			...maybeDot,
			...maybePreQuantifier,
			...maybePipe
		},
		HandleSingleChar
	)
}
