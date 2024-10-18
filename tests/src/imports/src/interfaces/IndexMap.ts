import { importTest, specificChildImports } from "imports/lib/imports.js"
import * as IndexMap from "../../../../../dist/src/IndexMap/interfaces.js"

import { typeof as type } from "@hgargg-0710/one"
const { isObject } = type

importTest(specificChildImports.IndexMap.concat([["SubHaving", isObject]]))(IndexMap)
