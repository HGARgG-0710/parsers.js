import { readdirSync } from "fs"
import { execSync } from "child_process"

function recursiveDescentTest(dir: string) {
	const tested = readdirSync(dir, { recursive: true })
		.filter((x) => !x.includes("lib"))
		.filter((x) => x.includes(".js")) as string[]
	for (const filename of tested)
		execSync(`node ${filename}`, {
			stdio: "inherit"
		})
}

recursiveDescentTest("./")
