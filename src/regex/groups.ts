import regex from "../regex.js"
import { bracket, non_bracket } from "./refactor.js"

import { functional } from "@hgargg-0710/one"
const { trivialCompose } = functional

export const capture = trivialCompose(regex, bracket) as (r: RegExp) => RegExp
export const non_capture = trivialCompose(regex, non_bracket) as (r: RegExp) => RegExp

export const named_capture = (name: string) => (regexp: RegExp) =>
	regex(`(?<${name}>${non_bracket(regexp)})`)

export const backref = (index: number | string) => () => regex(`\\${index}`)
export const named_backref = (name: string) => () => regex(`\\k<${name}>`)
