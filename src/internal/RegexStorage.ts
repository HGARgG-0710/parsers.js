import { RegexCompiler } from "./RegexCompiler/Compiler.js"

/**
 * This serves as a preliminary abstraction to `RegexCompiler`.
 * It caches all the regular expressions given.
 * Useful to avoid forced caching of `new Regex(...)` calls for
 * efficiency purposes due to repeated parsing.
 *
 * It is a singleton, obtained via `instance: RegexStorage`.
 */
export class RegexStorage {
	static readonly instance = new RegexStorage()

	// TODO: ADD PROPER TYPES FOR THIS!!! REPLACE THE `any` thingy...
	private readonly cached = new Map<string, any>()

	private makeNew(regex: string) {
		const compiled = RegexCompiler.instance.compile(regex)
		this.cached.set(regex, compiled)
		return compiled
	}

	private getCachedIfPresent(regex: string) {
		return this.cached.get(regex)
	}

	get(regex: string) {
		return this.getCachedIfPresent(regex) || this.makeNew(regex)
	}

	private constructor() {}
}
