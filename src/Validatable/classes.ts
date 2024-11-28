import type {
	DelegateValidatablePattern,
	FreeValidator,
	MethodValidator,
	ValidatableStringPattern as ValidatableStringPatternType,
	ValidationOutput
} from "./interfaces.js"

import { delegateValidatableValidate } from "./methods.js"
import { FlushablePattern } from "../Pattern/classes.js"
import { validateString } from "./utils.js"
import { extendClass } from "../utils.js"

export function DelegateValidatable<Type = any, KeyType = any>(
	validator: FreeValidator<Type, KeyType>
) {
	class delegateValidatablePattern
		extends FlushablePattern<Type>
		implements DelegateValidatablePattern<Type, KeyType>
	{
		value: Type
		result: ValidationOutput<Type>
		validate: MethodValidator<Type, KeyType>
		validator: FreeValidator<Type, KeyType>

		constructor(value: Type) {
			super(value)
		}
	}

	extendClass(delegateValidatablePattern, {
		validate: { value: delegateValidatableValidate },
		validator: { value: validator }
	})

	return delegateValidatablePattern
}

export const ValidatableString: new (value: string) => ValidatableStringPatternType =
	DelegateValidatable<string, string | RegExp>(validateString)
