import { functionImports, importTest } from "imports/lib/imports.js"
import * as quantifiers from "../../../../../dist/src/regex/quantifiers.js"
importTest(functionImports("occurences", "non_greedy", "plus", "star", "maybe"))(
	quantifiers
)
