import { object } from "@hgargg-0710/one"
import assert from "assert"
import { Parametrized, Regex } from "../../../../../objects.js"
import { Pairs } from "../../../../../samples.js"
import { ParseRegexRecursively } from "../../ParserBuilder.js"

const { dekv } = object

export const CustomExtensionGroups = new Parametrized(
	(extensions: Regex.Extension[]) => {
		return dekv(
			Pairs.from(
				extensions
					.filter((ext) => ext.getParserTableRow)
					.map((ext) => {
						const row = ext.getParserTableRow!(
							ParseRegexRecursively
						)
						const [char] = row
						assert(char.length === 1)
						return row
					})
			)
		)
	}
)
