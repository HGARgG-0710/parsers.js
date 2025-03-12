import { regex } from "../constants.js"

const {
	GlobalSearchFlag,
	UnicodeFlag,
	HasIndiciesFlag,
	CaseInsensitiveFlag,
	MultilineFlag,
	UnicodeSetsFlag,
	DotAllFlag,
	StickyFlag
} = regex

/**
 * Returns the flags of the given regular expression as an array of strings
 */
export const flags = (regex: RegExp) => regex.flags.split("")

/**
 * Returns a function for creating a regular expression based off
 * `regexp`, with guaranteed presence of the `flags`
 */
export const with_flags =
	(...flags: string[]) =>
	(regexp: RegExp) =>
		new RegExp(regexp, regexp.flags.concat(flags.join("")))

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

export default flags
