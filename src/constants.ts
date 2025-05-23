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

export const MissingArgument = undefined
