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
