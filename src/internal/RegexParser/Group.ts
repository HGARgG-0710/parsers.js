import type { array } from "@hgargg-0710/one"
import { RetainedArray, TableHandler } from "../../classes.js"
import { CurrentHash } from "../../classes/HashMap.js"
import { RecursiveNode } from "../../classes/Node.js"
import { LimitStream, SingletonStream } from "../../classes/Stream.js"
import type {
	IIterableStream,
	IOwnedStream,
	IStreamChooser
} from "../../interfaces.js"
import { ObjectMap } from "../../samples/TerminalMap.js"
import { consumable } from "../../utils/Stream.js"
import { HandleExtensionGroup } from "./Group/Extension.js"
import { HandleLookaheadGroup } from "./Group/Lookahead.js"
import { HandlePlainGroup } from "./Group/Plain.js"

const withBodyBuilder = consumable(new RetainedArray())

export const GroupBody = RecursiveNode("group-body")

const isGroupEnd = (input: IOwnedStream<string>) => input.curr === ")"

export const GroupLimitStream = LimitStream((input: IOwnedStream<string>) => {
	const isEnd = isGroupEnd(input)
	if (isEnd) input.next() // )
	return !isEnd
})

export const GroupBodyStream = SingletonStream(
	(input: IOwnedStream<string> & IIterableStream<string>) =>
		new GroupBody(withBodyBuilder(input).get() as any[])
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
