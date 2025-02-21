import type { ValidationError } from "./Parser/PatternValidator/interfaces.js"

import type {
	InvalidMatch,
	ValidationOutput,
	ValidMatch
} from "./Validatable/interfaces.js"

import { parameterWaster } from "./refactor.js"

import { boolean, object, array } from "@hgargg-0710/one"
const { T } = boolean

export namespace regex {
	export const IndefiniteOccurrences = ""

	// * flags constants
	export const GlobalSearchFlag = "g"
	export const UnicodeFlag = "u"
	export const HasIndiciesFlag = "d"
	export const CaseInsensitiveFlag = "i"
	export const MultilineFlag = "m"
	export const UnicodeSetsFlag = "v"
	export const DotAllFlag = "s"
	export const StickyFlag = "y"
}

export namespace Stream {
	export namespace StreamClass {
		export const PreCurrInit = 1
		export const PostCurrInit = true
		export const PostStart = false
	}

	export namespace LimitedStream {
		export const NoMovementPredicate = T
	}

	export namespace StreamParser {
		export const SkippedItem = undefined
	}
}

export namespace validation {
	export const ValidationSuccess = true

	export namespace ValidatablePattern {
		export const ValidMatch: ValidMatch = true
		export const InvalidMatch: InvalidMatch = false

		export const ValidationPassed = <Type = any>(
			result: Type[]
		): ValidationOutput<Type> => [ValidMatch, result]

		export const ValidationFailed = <Type = any>(
			result: (Type | true | [false, Type])[]
		): ValidationOutput<Type> => [InvalidMatch, result]

		export const FaultyElement = ValidationFailed as <Type = any>(
			x: Type
		) => [false, Type]
	}

	export namespace PatternValidator {
		export const NoFullCoverage = null
		export const FullCoverage = true
		export const ValidationError = (n: number): ValidationError => [false, n]
	}
}

export const BadIndex = -1

export namespace defaults {
	export namespace FreezableBuffer {
		export const isFrozen = false
	}

	export namespace EnumSpace {
		export const size = 0
		export const DefaultValue = array.empty
	}

	export namespace InternalHash {
		export namespace MapInternalHash {
			export const DefaultValue = parameterWaster(Map)
		}
		export namespace ObjectInternalHash {
			export const DefaultValue = object.empty
		}
	}

	export namespace MultiIndex {
		export const DefaultValue = array.empty
	}

	export namespace StreamClass {
		export const realCurr = null
	}

	export namespace TreeStream {
		export const lastLevelWithSiblings = BadIndex
		export const response = ""
	}
}
