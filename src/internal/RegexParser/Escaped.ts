import type { ICommonStream, INode, IOwnedStream } from "../../interfaces.js"
import { HandleBoundaryClass } from "./Class/BoundaryClass.js"
import { CurrCharHandler } from "./CurrCharHandler.js"
import { HandleDigit } from "./Escaped/Digit.js"
import { HandleFormFeed } from "./Escaped/FormFeed.js"
import { HandleEscapedLiteral } from "./Escaped/Literal.js"
import { HandleNewline } from "./Escaped/Newline.js"
import { HandleSpace } from "./Escaped/Space.js"
import { HandleTab } from "./Escaped/Tab.js"
import { HandleUnicode } from "./Escaped/Unicode.js"
import { HandleVTab } from "./Escaped/Vtab.js"
import { HandleWord } from "./Escaped/Word.js"

const EscapedHandler = CurrCharHandler<ICommonStream<INode>>(
	{
		w: HandleWord,
		d: HandleDigit,
		s: HandleSpace,
		u: HandleUnicode,
		n: HandleNewline,
		t: HandleTab,
		v: HandleVTab,
		f: HandleFormFeed,
		b: HandleBoundaryClass
	},
	HandleEscapedLiteral
)

const RangeBoundaryEscapedHandler = CurrCharHandler<ICommonStream<INode>>(
	{
		u: HandleUnicode,
		n: HandleNewline,
		t: HandleTab,
		v: HandleVTab,
		f: HandleFormFeed
	},
	HandleEscapedLiteral
)

export function HandleRangeBoundaryEscaped(input: IOwnedStream<string>) {
	input.next() // \
	return [RangeBoundaryEscapedHandler(input)]
}

export function HandleEscaped(input: IOwnedStream<string>) {
	input.next() // \
	return [EscapedHandler(input)]
}

export const maybeEscaped = {
	"\\": HandleEscaped
}
