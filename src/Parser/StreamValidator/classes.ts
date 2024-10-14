import type { ParserFunction, StreamPredicate } from "../TableMap/interfaces.js"
import type { StreamValidatorState } from "./interfaces.js"
import { GeneralParser, DefineFinished } from "../GeneralParser/classes.js"
import { streamValidatorChange, streamValidatorFinished } from "./methods.js"

export function StreamValidator<KeyType = any>(
	validator: ParserFunction<StreamValidatorState<KeyType>, StreamPredicate>
) {
	return GeneralParser<StreamValidatorState<KeyType>>(
		DefineFinished(
			{
				change: streamValidatorChange<KeyType>,
				parser: validator,
				result: true
			},
			streamValidatorFinished<KeyType>
		)
	)
}
