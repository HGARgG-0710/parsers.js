import { regex } from "../../../../dist/main.js"
import { complexRegexTest, elementaryRegexTest } from "./lib.js"
const { with_flags, g, u, d, i, m, v, s, y } = regex.flags

export const with_flags_test = complexRegexTest("with_flags", with_flags)
export const [g_test, u_test, d_test, i_test, m_test, v_test, s_test, y_test] = [
	["g", g],
	["u", u],
	["d", d],
	["i", i],
	["m", m],
	["v", v],
	["s", s],
	["y", y]
].map(([name, util]) => elementaryRegexTest(name as string, util as Function))
