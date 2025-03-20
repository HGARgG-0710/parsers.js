import { flagsRegexTest } from "./lib.js"
import { comparisonUtilTest } from "lib/lib.js"

import { regex } from "../../../../dist/main.js"
const { flags, g, u, d, i, m, v, s, y } = regex.flags

import { array } from "@hgargg-0710/one"

export const flags_test = comparisonUtilTest(array.same)(flags, "flags")

export const [g_test, u_test, d_test, i_test, m_test, v_test, s_test, y_test] =
	[
		["g", g],
		["u", u],
		["d", d],
		["i", i],
		["m", m],
		["v", v],
		["s", s],
		["y", y]
	].map(([name, util]) => flagsRegexTest(name as string, util as Function))
