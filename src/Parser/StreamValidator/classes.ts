import { GeneralParser, DefineFinished } from "../GeneralParser/classes.js"
import type { ParserMap, StreamHandler } from "../ParserMap/interfaces.js"
import type { StreamValidatorState } from "./interfaces.js"
import { streamValidatorChange, streamValidatorFinished } from "./methods.js"

export function StreamValidator<KeyType = any>(
	validator: ParserMap<KeyType, StreamHandler<boolean>, StreamValidatorState<KeyType>>
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
