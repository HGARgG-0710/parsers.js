import { regex_contents } from "../regex.js"

export const bracket = (regex: RegExp) => `(${regex_contents(regex)})`
export const non_bracket = (regex: RegExp) => `(?:${regex_contents(regex)})`

export const char_ranges = (...ranges: (string | [string, string])[]) =>
	ranges.map((r) => (typeof r === "string" ? r : `${r[0]}-${r[1]}`)).join("")
