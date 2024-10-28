import { utilTest } from "./lib.js"
import { utils } from "../../../dist/main.js"
const { isHex } = utils
export const isHexTest = utilTest(isHex, "isHex")
