import { ambigiousUtilTest } from "lib/lib.js"
import { uniNavigate } from "../../../../dist/src/Stream/StreamClass/utils.js"

export const [navigateTest] = [[uniNavigate, "uniNavigate"]].map(([util, name]) =>
	ambigiousUtilTest(util as Function, name as string)
)
