import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type { Resulting } from "../Pattern/interfaces.js"
import type {
	DelegateValidatablePattern,
	FreeValidator,
	ValidatableStringPattern as ValidatableStringPatternType,
	ValidationOutput,
	InvalidMatch,
	ValidMatch
} from "./interfaces.js"

import { FlushablePattern } from "src/Pattern/abstract.js"
import { validateString } from "./utils.js"
import { extendPrototype } from "../utils.js"

import { validation } from "../constants.js"
const { ValidationFailed } = validation.ValidatablePattern

import { inplace } from "@hgargg-0710/one"
const { replace } = inplace

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
		validator: FreeValidator<Type, KeyType>

		validate(
			key: KeyType,
			handler: SummatFunction<any, Type, ValidMatch | InvalidMatch>
		) {
			const [, validated] = this.result
			if (!validated.length)
				return (this.result = this.validator(this.value!, key, handler))

			let [tempValid] = this.result
			let tempRemains: any[] | null = null
			let i = validated.length

			while (i--) {
				;[tempValid, tempRemains] = this.validator(
					validated[i] as Type,
					key,
					handler
				)
				this.result[0] = tempValid
				replace(validated, i, ...tempRemains)
			}

			return this.result
		}

		constructor(value?: Type) {
			super(value)
		}
	}

	extendPrototype(delegateValidatablePattern, {
		validator: { value: validator }
	})

	return delegateValidatablePattern
}

export const ValidatableString: new (value?: string) => ValidatableStringPatternType =
	DelegateValidatable<string, string | RegExp>(validateString)
