import { regex_contents } from "../regex.js"
export const non_bracket = (regex: RegExp) => `(?:${regex_contents(regex)})`
