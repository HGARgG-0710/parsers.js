import { ErrorPrinter } from "../objects.js"

class XMLConfig {
	lf = true
	attrQuoteDouble = true
	tab = "\t"
}

class RegexConfig {
	errorPrinter: ErrorPrinter = ErrorPrinter.Plain.instance
	rawToStringLF: boolean = true
}

class UnicodeConfig {
	// ! pre-doc: this is a valid BCP-47 languages tag!
	// ! BCP 47 tag lookup: https://r12a.github.io/app-subtags/#note2
	locales: string[] = ["en-US"]
}

class ErrorConfig {
	tab = "\t"
}

class ErrorPrinterConfig {
	lf = true
	loggedNewlinesBetween = 2
}

class JSONConfig {
	spaces = 0
	replacer: null | (number | string)[] = null
}

// ! PRE-DOC [essential]: if the user EVER decides to switch the `enabled` back from `true` to `false`
// 	during runtime, it MUST be done *only* after all the pools have been cleared, as otherwise a memory
// 	leak of unknown size is guaranteedly created!
class ObjectPoolConfig {
	defaultSizeLimit = 1000
	enable = false // feature flag enabling the Object Pools (off by default)

	enableUnlimitedPools() {
		this.defaultSizeLimit = Infinity
	}
}

class LoggerConfig {
	defaultMaxWrites = 30000
}

class LibConfig {
	readonly xml = new XMLConfig()
	readonly regex = new RegexConfig()
	readonly unicode = new UnicodeConfig()
	readonly errors = new ErrorConfig()
	readonly errorPrinter = new ErrorPrinterConfig()
	readonly json = new JSONConfig()
	readonly objectPools = new ObjectPoolConfig()
	readonly logger = new LoggerConfig()
}

export const Config = new LibConfig()
