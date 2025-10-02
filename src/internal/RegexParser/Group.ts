import type { array } from "@hgargg-0710/one"
import type { IOwnedStream, IStreamChooser } from "../../interfaces.js"
import { ArrayBuilder, TableHandler } from "../../objects.js"
import { CurrentHash } from "../../objects/HashMap.js"
import {
	CollectionStream,
	EndBracketStream,
	isCurr
} from "../../samples/Stream.js"
import { ObjectMap } from "../../samples/TerminalMap.js"
import { consumable } from "../../utils/Stream.js"
import { HandleExtensionGroup } from "./Group/Extension.js"
import { HandleLookaheadGroup } from "./Group/Lookahead.js"
import { HandlePlainGroup } from "./Group/Plain.js"
import { GroupBody } from "./Nodes.js"

export const GroupLimitStream = EndBracketStream(isCurr(")"))

export const GroupBodyStream = CollectionStream(
	GroupBody,
	consumable(new ArrayBuilder())
)

const GroupHandler = TableHandler(
	new CurrentHash(
		ObjectMap(
			{
				"#": HandleExtensionGroup,
				"=": HandleLookaheadGroup
			},
			HandlePlainGroup
		)
	)
)

function handleGroup(input: IOwnedStream<string>) {
	input.next() // (
	return GroupHandler(input)
}

export const maybeGroup: array.Pairs<string, IStreamChooser> = [
	["(", handleGroup]
]
