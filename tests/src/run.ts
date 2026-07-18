import { execSync } from "child_process"
import { readdirSync } from "fs"
import { basename, join } from "path"

const CurrFileName = basename(import.meta.filename)
const PermittedPaths: string[] = []

function toCrossplatformPath(filepath: string) {
	return filepath.replace(/\\/g, "/").replace(/\/+/g, "/")
}

function isCurrScript(filename: string) {
	return filename === CurrFileName
}

function fromCaseToClassName(filename: string) {
	if (filename === "mixin/cases.js") return "mixin"
	const [_part, className, _tail] = filename.split("/")
	return className
}

function isPermitted(filename: string) {
	return (
		!isCurrScript(filename) &&
		PermittedPaths.includes(
			fromCaseToClassName(toCrossplatformPath(filename))
		)
	)
}

function inCurrDir(filepath: string) {
	return join(import.meta.dirname, filepath)
}

function recursiveTest(dir: string) {
	const tested = readdirSync(inCurrDir(dir), {
		recursive: true
	})
		.filter((x) => !x.includes("lib."))
		.filter((x) => !x.includes(".map"))
		.filter((x) => x.includes(".js")) as string[]

	for (const filename of tested)
		if (isPermitted(filename))
			execSync(`node ${inCurrDir(filename)}`, {
				stdio: "inherit"
			})
}

recursiveTest("./")
