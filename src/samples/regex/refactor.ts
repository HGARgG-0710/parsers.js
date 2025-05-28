import { regex } from "../regex.js"
export const non_bracket = (regexp: RegExp) => `(?:${regex.contents(regexp)})`
