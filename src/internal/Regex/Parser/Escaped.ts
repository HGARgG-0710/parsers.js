import { object } from "@hgargg-0710/one"
import type { IOwnedStream, IRawStreamArray } from "../../../interfaces.js"
import { HandleBoundaryClass } from "./Class/BoundaryClass.js"
import { HandleDigit } from "./Escaped/Digit.js"
import { HandleFormFeed } from "./Escaped/FormFeed.js"
import { HandleEscapedLiteral } from "./Escaped/Literal.js"
import { HandleNewline } from "./Escaped/Newline.js"
import { HandleSpace } from "./Escaped/Space.js"
import { HandleTab } from "./Escaped/Tab.js"
import { HandleUnicodeChar } from "./Escaped/UnicodeChar.js"
import { HandleUnicodeProperty } from "./Escaped/UnicodeProperty.js"
import { HandleVTab } from "./Escaped/Vtab.js"
import { HandleWord } from "./Escaped/Word.js"
import { CurrCharHandler } from "./Utils/CurrCharHandler.js"

const EscapedHandler = CurrCharHandler<IRawStreamArray>(
	{
		w: HandleWord,
		d: HandleDigit,
		s: HandleSpace,
		u: HandleUnicodeChar,
		n: HandleNewline,
		t: HandleTab,
		v: HandleVTab,
		f: HandleFormFeed,
		b: HandleBoundaryClass,
		p: HandleUnicodeProperty
	},
	HandleEscapedLiteral
)

const rangeBoundaryMap = {
	u: HandleUnicodeChar,
	n: HandleNewline,
	t: HandleTab,
	v: HandleVTab,
	f: HandleFormFeed
}

const RangeBoundaryEscapedHandler = CurrCharHandler<IRawStreamArray>(
	rangeBoundaryMap,
	HandleEscapedLiteral
)

const validRangeBoundaryStarts = new Set(object.keys(rangeBoundaryMap))

export function canBeRangeBoundaryStart(char: string) {
	if (char.length > 1) return false
	return validRangeBoundaryStarts.has(char)
}

export function HandleRangeBoundaryEscaped(input: IOwnedStream<string>) {
	input.next() // \
	return RangeBoundaryEscapedHandler(input)
}

export function HandleEscaped(input: IOwnedStream<string>) {
	input.next() // \
	return EscapedHandler(input)
}

export const maybeEscaped = {
	"\\": HandleEscaped
}
