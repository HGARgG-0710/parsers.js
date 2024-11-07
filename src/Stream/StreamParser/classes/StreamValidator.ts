import type { Summat } from "@hgargg-0710/summat.ts"
import type { StreamPredicate } from "src/Parser/TableMap/interfaces.js"
import { LocatorStream } from "../classes.js"
import type { EndableStream } from "src/Stream/StreamClass/interfaces.js"
import type {
	ValidationError,
	ValidationSuccess
} from "src/Parser/PatternValidator/interfaces.js"

export function StreamValidator(validator: StreamPredicate, defaultState?: Summat) {
	const ValidatorStreamBase = LocatorStream(validator, true, !!defaultState)
	const validationStream = new ValidatorStreamBase()
	return function <Type = any>(
		stream: EndableStream<Type>,
		state: Summat | undefined = defaultState
	): ValidationSuccess | ValidationError {
		validationStream.init(stream, state)
		while (!validationStream.isEnd) {
			if (!validationStream.curr) return [false, validationStream.pos as number]
			validationStream.next()
		}
		return true
	}
}
