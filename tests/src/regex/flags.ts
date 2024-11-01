import {
	d_test,
	flags_test,
	g_test,
	i_test,
	m_test,
	s_test,
	u_test,
	v_test
} from "./lib/flags.js"

// * flags
flags_test(["y", "m", "s"], /ba[ac]+/msy)
flags_test(["g", "i"], /ba[ac]+/gi)
flags_test([], /ba[ac]+/)

// * g
g_test(["g"], /ab?/)
g_test(["s", "u", "g"], /ab?/su)

// * u
u_test(["u"], /ab?/)
u_test(["g", "s", "u"], /ab?/gs)

// * d
d_test(["d"], /ab?/)
d_test(["g", "s", "d"], /ab?/gs)

// * i
i_test(["i"], /ab?/)
i_test(["g", "s", "i"], /ab?/gs)

// * m
m_test(["m"], /ab?/)
m_test(["g", "s", "m"], /ab?/gs)

// * v
v_test(["v"], /ab?/)
v_test(["g", "s", "v"], /ab?/gs)

// * s
s_test(["s"], /ab?/)
s_test(["g", "u", "s"], /ab?/gu)

// * y
s_test(["y"], /ab?/)
s_test(["g", "s", "y"], /ab?/gs)
