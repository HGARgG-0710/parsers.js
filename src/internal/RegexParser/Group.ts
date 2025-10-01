import type { array } from "@hgargg-0710/one"
import { ArrayBuilder, TableHandler } from "../../classes.js"
import { CurrentHash } from "../../classes/HashMap.js"
import { RecursiveNode } from "../../classes/Node.js"
import type { IOwnedStream, IStreamChooser } from "../../interfaces.js"
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

export const GroupBody = RecursiveNode("group-body")

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
