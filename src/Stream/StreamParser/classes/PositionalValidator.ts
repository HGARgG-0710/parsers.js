import type { Summat } from "@hgargg-0710/summat.ts"
import type { StreamPredicate } from "../../../Parser/TableMap/interfaces.js"
import type { EndableStream } from "../../../Stream/StreamClass/interfaces.js"
import type { InvalidEntries } from "../../../Validatable/interfaces.js"

import { LocatorStream } from "../classes.js"

export function PositionalValidator(validator: StreamPredicate, defaultState?: Summat) {
	const PositionalValidatorBase = LocatorStream(validator, true, !!defaultState)
	const validationStream = new PositionalValidatorBase()

	return function <Type = any>(
		stream: EndableStream<Type>,
		state: Summat | undefined = defaultState
	) {
		const erronous: InvalidEntries<Type> = []
		validationStream.init(stream, state)

		while (!validationStream.isEnd) {
			const curr: Type = stream.curr
			if (!validationStream.curr) erronous.push([validationStream.pos!, curr])
			validationStream.next()
		}

		return erronous
	}
}
