import { utilTest } from "lib/lib.js"
import { isType, isToken } from "../../../../dist/src/Token/utils.js"

export const [isTypeTest, isTokenTest] = [
	[(type: any, object: any) => isType(type)(object), "isType"],
	[isToken, "isToken"]
].map(([util, name]) => utilTest(util as Function, name as string))
