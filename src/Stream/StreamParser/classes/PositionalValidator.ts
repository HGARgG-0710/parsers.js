import type { Summat } from "@hgargg-0710/summat.ts"

import type { IInvalidEntries } from "../../../interfaces.js"
import type { IStreamPredicate } from "../../../TableMap/interfaces.js"
import type { IEndableStream } from "src/Stream/interfaces.js"
import type { IStreamClassStatePatternInitMethod } from "../../StreamClass/methods/init.js"

import { LocatorStream } from "../classes.js"

export function PositionalValidator<Type = any>(
	validator: IStreamPredicate<Type>,
	defaultState?: Summat
) {
	const validationStream = new (LocatorStream<Type>(
		true,
		!!defaultState
	)(validator))()

	return function (
		stream: IEndableStream<Type>,
		state: Summat | undefined = defaultState
	) {
		// * reason: '.initGetter/.currGetter' COULD be calling 'stream.next()' under the hood,
		// thus, changing the 'stream.curr' value
		let curr = stream.curr

		;(validationStream.init as IStreamClassStatePatternInitMethod)(
			stream,
			state
		)

		const erronous: IInvalidEntries<Type> = []
		for (const vcurr of validationStream) {
			if (!vcurr) erronous.push([validationStream.pos!, curr])
			curr = stream.curr
		}

		return erronous
	}
}
