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

export const flags = (regex: RegExp) => regex.flags.split("")

export const with_flags = (flags: string[]) => (regexp: RegExp) =>
	new RegExp(regexp, regexp.flags.concat(flags.join("")))

const with_flag = (flag: string) => with_flags([flag])

export const g = with_flag(GlobalSearchFlag)
export const u = with_flag(UnicodeFlag)
export const d = with_flag(HasIndiciesFlag)
export const i = with_flag(CaseInsensitiveFlag)
export const m = with_flag(MultilineFlag)
export const v = with_flag(UnicodeSetsFlag)
export const s = with_flag(DotAllFlag)
export const y = with_flag(StickyFlag)

export default flags
