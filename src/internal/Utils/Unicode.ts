import { Config } from "../../global.js"

export function toLowerCase(char: string) {
	return char.toLocaleLowerCase(Config.unicode.locales)
}

export function toUpperCase(char: string) {
	return char.toLocaleUpperCase(Config.unicode.locales)
}
