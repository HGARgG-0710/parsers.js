import type { array } from "@hgargg-0710/one"
import { SourceBuilder } from "../../classes.js"
import { ContentNode } from "../../classes/Node.js"
import { LimitStream, SingletonStream } from "../../classes/Stream.js"
import type {
	INode,
	IOwnedStream,
	IPeekable,
	IPeekableStream,
	IStreamChooser
} from "../../interfaces.js"
import { consume } from "../../utils/Stream.js"
import { HandleSingleChar } from "./SingleChar.js"

const TypeMatch = ContentNode<string, string>("type-match")
const AsString = ContentNode<string, INode<string>>("as-string")
const AsInt = ContentNode<string, INode<string>>("as-int")

const typeMatchBuilder = new SourceBuilder()

const AsIntStream = SingletonStream((input) => new AsInt(input.curr))

const AsStringStream = SingletonStream((input) => new AsString(input.curr))

const TypeMatchStream = SingletonStream(
	(input: IOwnedStream<string> & Iterable<string>) => {
		typeMatchBuilder.clear()
		return new TypeMatch(consume(input, typeMatchBuilder).get())
	}
)

const TypeMatchLimitsStream = LimitStream((input) => input.curr === "}")

function isTypeMatchStart(stream: IPeekableStream<string>) {
	return stream.peek(1) === "{"
}

function HandleIntTypeMatch(input: IOwnedStream<string> & IPeekable<string>) {
	if (!isTypeMatchStart(input)) return HandleSingleChar()
	input.next() // i
	input.next() // {
	return [AsIntStream(), TypeMatchStream(), TypeMatchLimitsStream()]
}

function HandleStringTypeMatch(
	input: IOwnedStream<string> & IPeekable<string>
) {
	if (!isTypeMatchStart(input)) return HandleSingleChar()
	input.next() // s
	input.next() // {
	return [AsStringStream(), TypeMatchStream(), TypeMatchLimitsStream()]
}

export const maybeTypeMatch: array.Pairs<string, IStreamChooser> = [
	["i", HandleIntTypeMatch],
	["s", HandleStringTypeMatch]
]
