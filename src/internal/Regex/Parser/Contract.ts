// * This file contains various abstractions needed to satisfy contracts
// * between different parts of the parser. In particular, it ensures that
// * nested instances of the same recursive sub-parsers *do not* clash,
// * and that contracts for the provision of from a resource deeper than
// * the immediate 'this.resource' can also be satisfied.
// CHANGE STUFF IN THIS STUFF AT YOUR OWN PERIL!

import { DepthMarkStream, MarkerStream } from "../../../objects/Stream.js"

export enum RegexMarks {
	Group = 0
}

export const EnableClbrackStream = DepthMarkStream([RegexMarks.Group])

export const ClassEndMarkerStream = MarkerStream(() => CLASS_END_MARKER)

export const CLASS_END_MARKER = "classEnd"
