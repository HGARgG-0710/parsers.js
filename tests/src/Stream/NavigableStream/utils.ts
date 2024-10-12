import { utilTest } from "lib/lib.js"
import { uniNavigate } from "../../../../dist/src/Stream/StreamClass/utils.js"

export const [navigateTest] = [[uniNavigate, "uniNavigate"]].map(([util, name]) =>
	utilTest(util as Function, name as string)
)
