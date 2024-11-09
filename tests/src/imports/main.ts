import { importTest, objectImports } from "./lib/imports.js"
import * as main from "../../../dist/main.js"

importTest(objectImports("classes", "constants", "methods", "regex", "utils"))(
	"main",
	main
)
