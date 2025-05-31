import { readdirSync } from "fs"
import { execSync } from "child_process"
import { basename, join } from "path"

function inCurrDir(filepath: string) {
	return join(import.meta.dirname, filepath)
}

function recursiveTest(dir: string) {
	const currFileName = basename(import.meta.filename)
	const tested = readdirSync(inCurrDir(dir), {
		recursive: true
	})
		.filter((x) => !x.includes("lib/"))
		.filter((x) => !x.includes(".map"))
		.filter((x) => x.includes(".js")) as string[]

	for (const filename of tested)
		if (filename !== currFileName)
			execSync(`node ${inCurrDir(filename)}`, {
				stdio: "inherit"
			})
}

recursiveTest("./")
