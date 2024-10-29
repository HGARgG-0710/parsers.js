import { flagsRegexTest } from "./lib.js"
import { arraysSame, comparisonUtilTest } from "lib/lib.js"

import { regex } from "../../../../dist/main.js"
const { flags, with_flags, g, u, d, i, m, v, s, y } = regex.flags

export const flags_test = comparisonUtilTest(arraysSame)(flags, "flags")

export const [
	with_flags_test,
	g_test,
	u_test,
	d_test,
	i_test,
	m_test,
	v_test,
	s_test,
	y_test
] = [
	["with_flags", with_flags],
	["g", g],
	["u", u],
	["d", d],
	["i", i],
	["m", m],
	["v", v],
	["s", s],
	["y", y]
].map(([name, util]) => flagsRegexTest(name as string, util as Function))
