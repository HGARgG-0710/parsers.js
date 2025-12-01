class XMLConfig {
	lf = true
	attrQuoteDouble = true
	tab = "\t"
}

class LibConfig {
	readonly xml = new XMLConfig()
}

export const Config = new LibConfig()
