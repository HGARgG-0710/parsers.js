import type { SummatFunction } from "@hgargg-0710/summat.ts"
import type {
	DelegateValidatablePattern,
	FreeValidator,
	ValidatableStringPattern as ValidatableStringPatternType,
	InvalidMatch,
	ValidMatch
} from "./interfaces.js"

import { FlushableValidatable } from "./abstract.js"
import { validateString } from "./utils.js"
import { extendPrototype } from "src/refactor.js"

import { inplace } from "@hgargg-0710/one"
const { replace } = inplace

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
