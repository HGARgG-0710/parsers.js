import type { ValidationError } from "./Parser/PatternValidator/interfaces.js"

import type {
	InvalidMatch,
	ValidationOutput,
	ValidMatch
} from "./Validatable/interfaces.js"

import { boolean } from "@hgargg-0710/one"
const { T } = boolean

export namespace regex {
	/**
	 * The regular expression flag for `RegExp.prototype.global`
	 */
	export const GlobalSearchFlag = "g"

	/**
	 * The regular expression flag for `RegExp.prototype.unicode`
	 */
	export const UnicodeFlag = "u"

	/**
	 * The regular expression flag for `RegExp.prototype.hasIndicies`
	 */
	export const HasIndiciesFlag = "d"

	/**
	 * The regular expression flag for `RegExp.prototype.ignoreCase`
	 */
	export const CaseInsensitiveFlag = "i"

	/**
	 * The regular expression flag for `RegExp.prototype.multiline`
	 */
	export const MultilineFlag = "m"

	/**
	 * The regular expression flag for `RegExp.prototype.unicodeSets`
	 */
	export const UnicodeSetsFlag = "v"

	/**
	 * The regular expression flag for `RegExp.prototype.dotAll`
	 */
	export const DotAllFlag = "s"

	/**
	 * The regular expression flag for `RegExp.prototype.sticky`
	 */
	export const StickyFlag = "y"
}

export namespace Stream {
	export namespace LimitedStream {
		/**
		 * The predicate that has to be used as the argument for the `from`
		 * argument of `LimitedStream` in order to preserve the current
		 * position upon call to the `.init` initialization method.
		 *
		 * Note: If `to` is not passed, value for `from` is used for it instead,
		 * and this becomes the value for `from`
		 */
		export const NoMovementPredicate = T
	}

	export namespace StreamParser {
		/**
		 * The value to be returned from the `.handler` on
		 * `StreamParser`, if the current item of the underlying
		 * `.value`-`Stream` is to be skipped
		 *
		 * When encountered during the `.next()` call, `StreamParser`
		 * will continue calling `.handler` until the return value of
		 * it differs from `SkippedItem`.
		 */
		export const SkippedItem = undefined
	}
}

export namespace validation {
	/**
	 * Value returned from various validators to signify success
	 */
	export const ValidationSuccess = true

	export namespace ValidatablePattern {
		/**
		 * Value used by the `ValidatablePattern` to signify
		 * a validly matched item
		 */
		export const ValidMatch: ValidMatch = true

		/**
		 * Value used by the `ValidatablePattern` to signify
		 * an invalidly matched item
		 */
		export const InvalidMatch: InvalidMatch = false

		/**
		 * A wrapper-function, destined to signify that
		 * the validation has been successful
		 * (id est, there are no `InvalidMatch`es)
		 */
		export const ValidationPassed = <Type = any>(
			result: Type[]
		): ValidationOutput<Type> => [true, result]

		/**
		 * A wrapper-function, destined to signify that
		 * the validation has not been successful
		 * (id est, there is at least one `InvalidMatch`)
		 */
		export const ValidationFailed = <Type = any>(
			result: (Type | true | [false, Type])[]
		): ValidationOutput<Type> => [false, result]

		/**
		 * A wrapper-function, destined to signify an
		 * element considered during validation to be
		 * an `InvalidMatch`
		 */
		export const FaultyElement = ValidationFailed as <Type = any>(
			x: Type
		) => [false, Type]
	}

	export namespace PatternValidator {
		/**
		 * A value returned from `PatternValidator`
		 * destined to signify that the given source (`ValidatablePattern`)
		 * is not fully covered by (id est, ambigiuos in relation to)
		 * the given validation table
		 */
		export const NoFullCoverage = null

		/**
		 * A value returned from `PatternValidator`
		 * destined to signify that the given source (`ValidatablePattern`)
		 * is fully covered by (id est, ambigiuos in relation to)
		 * the given validation table and is valid
		 */
		export const FullCoverage = true

		/**
		 * A wrapper-function used for return-values from `PatternValidator`
		 * destined to signify that the given source (`ValidatablePattern`)
		 * is cannot be validated using given table.
		 *
		 * The numeric value at index `1` is the position inside the table that
		 * has caused problems during validation.
		 */
		export const ValidationError = (n: number): ValidationError => [
			false,
			n
		]
	}
}

/**
 * Constant used to designate an invalid index position.
 *
 * Applied in contexts:
 *
 * 1. checking an index for correctness
 * 2. checking non-emptiness of an array
 * 3. invalidating an obsolete `IPointer` instance
 * 4. as a default value whene using a valid value makes no sense
 */
export const BadIndex = -1
