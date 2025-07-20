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
import { consume } from "../../utils/Stream.js"
import { HandleExtensionGroup } from "./Group/Extension.js"
import { HandleLookaheadGroup } from "./Group/Lookahead.js"
import { HandleLookbehindGroup } from "./Group/Lookbehind.js"
import { HandlePlainGroup } from "./Group/Plain.js"

const bodyBuilder = new RetainedArray()

export const GroupBody = RecursiveNode("group-body")

export const GroupLimitStream = LimitStream((input) => input.curr === ")")

export const GroupBodyStream = SingletonStream(
	(input: IOwnedStream<string> & IIterableStream<string>) => {
		bodyBuilder.clear()
		return new GroupBody(consume(input, bodyBuilder).get() as any[])
	}
)

const GroupHandler = TableHandler(
	new CurrentHash(
		ObjectMap(
			{
				"#": HandleExtensionGroup,
				"=": HandleLookaheadGroup,
				"<": HandleLookbehindGroup
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
