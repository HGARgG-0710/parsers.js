import {
	ConstEnum,
	TokenInstanceEnum,
	SimpleTokenTypeEnum
} from "../../../../dist/src/Pattern/EnumSpace/classes.js"
import type { Mappable } from "../../../../dist/src/Pattern/EnumSpace/interfaces.js"

import { EnumSpaceTest, TokenMappingTest } from "./lib/classes.js"

// * ConstEnum

const baseEnumTestSignature = {
	increases: [2, 5, 0],
	joined: [new ConstEnum(4), new ConstEnum(7), new ConstEnum(20)],
	mapTests: [
		[(x: {}) => ({ s: x }), (x: any, y: any) => x.s === y],
		[(_x: any, i: number) => i, (x: any, _y: any, i: number) => x === i]
	] as [Mappable, (x: any, y: any, i?: number) => boolean][]
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

const tokenMappingTest = [
	{ instance: new ConstEnum(20) },
	{ instance: new ConstEnum(0) },
	{ instance: new ConstEnum(5) }
]

// * TokenInstanceEnum
TokenMappingTest("TokenInstanceEnum", TokenInstanceEnum, tokenMappingTest)

// * SimpleTokenTypeEnum
TokenMappingTest("SimpleTokenTypeEnum", SimpleTokenTypeEnum, tokenMappingTest)
