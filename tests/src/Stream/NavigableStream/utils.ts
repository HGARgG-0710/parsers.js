import { utilTest } from "lib/lib.js"
import { navigate } from "../../../../dist/src/Stream/NavigableStream/utils.js"

export const [navigateTest] = [[navigate, "navigate"]].map(([util, name]) =>
	utilTest(util as Function, name as string)
)
