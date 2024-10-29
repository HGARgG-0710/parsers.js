export const flags = (regex: RegExp) => regex.flags.split("")

export const with_flags = (flags: string) => (regexp: RegExp) =>
	new RegExp(regexp, regexp.flags.concat(flags))

export const [g, u, d, i, m, v, s, y] = ["g", "u", "d", "i", "m", "v", "s", "y"].map(
	with_flags
)

export default flags
