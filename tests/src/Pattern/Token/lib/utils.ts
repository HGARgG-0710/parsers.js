import { utilTest } from "lib/lib.js"
import { utils } from "../../../../../dist/main.js"
const { isType } = utils.Pattern.Token

export const isTypeTest = utilTest(
	(type: any, object: any) => isType(type)(object),
	"isType"
)
