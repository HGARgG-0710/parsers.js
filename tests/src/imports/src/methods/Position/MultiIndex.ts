import {
	functionImports,
	importTest,
	namesCapitalized,
	prefixedImportNames,
	specificChildImports
} from "imports/lib/imports.js"

import * as MultiIndex from "../../../../../../dist/src/Position/MultiIndex/methods.js"

importTest(
	functionImports(
		...prefixedImportNames("multiIndex")(
			...namesCapitalized("compare", "equal", "copy", "slice", "convert").concat([
				"FirstLevel",
				"LastLevel",
				"LevelsGetter",
				"LevelsSetter"
			])
		)
	).concat(specificChildImports.MultiIndex)
)(MultiIndex)
