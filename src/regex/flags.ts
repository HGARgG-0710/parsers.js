import { regex } from "src/constants.js"
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

export const flags = (regex: RegExp) => regex.flags.split("")

export const with_flags = (flags: string[]) => (regexp: RegExp) =>
	new RegExp(regexp, regexp.flags.concat(flags.join("")))

export const [g, u, d, i, m, v, s, y] = [
	[GlobalSearchFlag],
	[UnicodeFlag],
	[HasIndiciesFlag],
	[CaseInsensitiveFlag],
	[MultilineFlag],
	[UnicodeSetsFlag],
	[DotAllFlag],
	[StickyFlag]
].map(with_flags)

export default flags
