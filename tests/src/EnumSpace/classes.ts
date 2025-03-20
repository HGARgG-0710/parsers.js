import type { IMappable } from "../../../dist/src/interfaces.js"
import { ConstEnum } from "../../../dist/src/EnumSpace/classes.js"

import { EnumSpaceTest } from "./lib/classes.js"

// * ConstEnum

const baseEnumTestSignature = {
	increases: [2, 5, 0],
	joined: [new ConstEnum(4), new ConstEnum(7), new ConstEnum(20)],
	mapTests: [
		[(x: {}) => ({ s: x }), (x: any, y: any) => x.s === y],
		[(_x: any, i: number) => i, (x: any, _y: any, i: number) => x === i]
	] as [IMappable, (x: any, y: any, i?: number) => boolean][]
}

EnumSpaceTest("ConstEnum", ConstEnum, [
	{
		size: 10,
		...baseEnumTestSignature,
		furtherSignature: {
			...baseEnumTestSignature,
			isCopyTest: false
		}
	}
])
