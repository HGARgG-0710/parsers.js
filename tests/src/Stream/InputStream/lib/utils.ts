import { predicateUtilTest } from "lib/lib.js"
import { utils } from "../../../../../dist/main.js"
import { isInputStream } from "./classes.js"
const { toInputStream } = utils.Stream.InputStream

export const toInputStreamTest = predicateUtilTest(isInputStream)(
	toInputStream,
	"toInputStream"
)
