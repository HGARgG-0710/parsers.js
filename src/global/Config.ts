class XMLConfig {
	lf = true
}

class LibConfig {
	readonly xml = new XMLConfig()
}

export const Config = new LibConfig()
