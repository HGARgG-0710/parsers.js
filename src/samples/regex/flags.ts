/**
 * Returns the flags of the given regular expression as an array of strings
 */
export function flags(regex: RegExp) {
	return regex.flags.split("")
}

export namespace flags {
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

	/**
	 * Returns a function for creating a regular expression based off
	 * `regexp`, with guaranteed presence of the `flags`
	 */
	export const with_flags =
		(...flags: string[]) =>
		(regexp: RegExp) =>
			new RegExp(
				regexp,
				Array.from(new Set(regexp.flags.split("").concat(flags))).join(""),
			)

	/**
	 * Alias for `with_flag("g")`
	 */
	export const g = with_flags(GlobalSearchFlag)

	/**
	 * Alias for `with_flag("u")`
	 */
	export const u = with_flags(UnicodeFlag)

	/**
	 * Alias for `with_flags("d")`
	 */
	export const d = with_flags(HasIndiciesFlag)

	/**
	 * Alias for `with_flags("i")`
	 */
	export const i = with_flags(CaseInsensitiveFlag)

	/**
	 * Alias for `with_flags("m")`
	 */
	export const m = with_flags(MultilineFlag)

	/**
	 * Alias for `with_flags("v")`
	 */
	export const v = with_flags(UnicodeSetsFlag)

	/**
	 * Alias for `with_flags("s")`
	 */
	export const s = with_flags(DotAllFlag)

	/**
	 * Alias for `with_flags("y")`
	 */
	export const y = with_flags(StickyFlag)
}
