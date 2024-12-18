import type { Resulting } from "../Pattern/interfaces.js"
import type {
	DelegateValidatablePattern,
	FreeValidator,
	MethodValidator,
	ValidatableStringPattern as ValidatableStringPatternType,
	ValidationOutput
} from "./interfaces.js"

import { validate } from "./methods.js"
import { FlushablePattern } from "src/Pattern/abstract.js"
import { validateString } from "./utils.js"
import { extendPrototype } from "../utils.js"

import { validation } from "../constants.js"
const { ValidationFailed } = validation.ValidatablePattern

// * Note: due to the way this is defined, for validity analysis, it's better to use 'analyzeValidity' util than just '!!this.result[0]':
// * 		it returns an empty array both when '!.result[1].length' and when '!!result[0]';
export abstract class FlushableValidatable<Type = any>
	extends FlushablePattern<Type>
	implements Resulting<ValidationOutput<Type>>
{
	result: ValidationOutput<Type>
	flush(): void {
		this.result = ValidationFailed<any>([])
	}
}

export function DelegateValidatable<Type = any, KeyType = any>(
	validator: FreeValidator<Type, KeyType>
) {
	class delegateValidatablePattern
		extends FlushableValidatable<Type>
		implements DelegateValidatablePattern<Type, KeyType>
	{
		value: Type
		validate: MethodValidator<Type, KeyType>
		validator: FreeValidator<Type, KeyType>

		constructor(value: Type) {
			super(value)
		}
	}

	extendPrototype(delegateValidatablePattern, {
		validate: { value: validate },
		validator: { value: validator }
	})

	return delegateValidatablePattern
}

export const ValidatableString: new (value: string) => ValidatableStringPatternType =
	DelegateValidatable<string, string | RegExp>(validateString)
