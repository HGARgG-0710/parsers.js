import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames
} from "imports/lib/imports.js"

import * as PersistentIndexMap from "../../../../../../dist/src/IndexMap/PersistentIndexMap/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("persistentIndexMap")(
			...namesCapitalized("add", "delete", "unique", "swap").concat(["GetIndex"])
		)
	)
)("PersistentIndexMap", PersistentIndexMap)
