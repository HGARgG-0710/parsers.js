import type { Summat } from "@hgargg-0710/summat.ts"

import type { StreamPredicate } from "../../../Parser/TableMap/interfaces.js"
import type { EndableStream } from "../../../Stream/StreamClass/interfaces.js"
import type { InvalidEntries } from "../../../Validatable/interfaces.js"
import type { StatePatternInitMethod } from "../../StreamClass/methods/init.js"

import { LocatorStream } from "../classes.js"

export function PositionalValidator(validator: StreamPredicate, defaultState?: Summat) {
	const validationStream = new (LocatorStream(validator, true, !!defaultState))()

	return function <Type = any>(
		stream: EndableStream<Type>,
		state: Summat | undefined = defaultState
	) {
		// * reason: '.initGetter/.currGetter' COULD be calling 'stream.next()' under the hood,
		// thus, changing the 'stream.curr' value
		let curr = stream.curr

		;(validationStream.init as StatePatternInitMethod)(stream, state)

		const erronous: InvalidEntries<Type> = []
		for (const vcurr of validationStream) {
			if (!vcurr) erronous.push([validationStream.pos!, curr])
			curr = stream.curr
		}

		return erronous
	}
}
