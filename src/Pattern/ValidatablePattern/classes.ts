import type {
	DelegateValidatablePattern,
	FreeValidator,
	MethodValidator,
	ValidatableStringPattern as ValidatableStringPatternType,
	ValidationOutput
} from "./interfaces.js"
import { delegateValidatablePatternValidate } from "./methods.js"
import { FlushablePattern } from "../classes.js"
import { validateString } from "./utils.js"

export function DelegateValidatablePattern<Type = any, KeyType = any>(
	validator: FreeValidator<Type, KeyType>
) {
	class delegateValidatablePattern
		extends FlushablePattern<Type>
		implements DelegateValidatablePattern<Type, KeyType>
	{
		result: ValidationOutput<Type>
		validate: MethodValidator<Type, KeyType>
		validator: FreeValidator<Type, KeyType>

		constructor(value: Type) {
			super(value)
		}
	}

	Object.defineProperties(delegateValidatablePattern.prototype, {
		validate: { value: delegateValidatablePatternValidate },
		validator: { value: validator }
	})

	return delegateValidatablePattern
}

export const ValidatableStringPattern: new (
	value: string
) => ValidatableStringPatternType = DelegateValidatablePattern<string, string | RegExp>(
	validateString
)
