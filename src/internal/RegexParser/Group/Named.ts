import { SourceBuilder } from "../../../classes.js"
import { BaseNode, ContentNode } from "../../../classes/Node.js"
import {
	DyssyncOwningStream,
	LimitStream,
	SingletonStream
} from "../../../classes/Stream.js"
import type {
	ILinkedStream,
	INode,
	IOwnedStream,
	IStreamChoice
} from "../../../interfaces.js"
import { consume } from "../../../utils/Stream.js"
import { GroupBodyStream, GroupLimitStream } from "../Group.js"

const nameBuilder = new SourceBuilder()

const GroupName = ContentNode<string, string>("group-name")

class NamedGroupNode extends BaseNode<string> {
	get type() {
		return "named-group"
	}
}

// todo: FINISH THIS [suppoosed to outlive the underlying Stream! One iteration - TWO STREAMS FINISHED:
// * 1. `name` (result goes to `nameNode`) and
// * 2. `body` (result goes to `bodyNode`) ]
// ! This STILL only has JUST ONE call to `.next()`.
// * It *collects* the two underlying in-progression `IStream`s *into one*.
class NamedGroupStream
	extends DyssyncOwningStream.generic!<INode<string>>()
	implements ILinkedStream<INode<string>>
{
	private nameNode: INode<string>
	private bodyNode: INode<string>

	next() {}
}

const GroupNameLimitStream = LimitStream((input) => input.curr === "}")
const NameStream = SingletonStream(
	(input: IOwnedStream<string> & Iterable<string>) => {
		nameBuilder.clear()
		return new GroupName(consume(input, nameBuilder).get())
	}
)

function ParseGroupName() {
	return [NameStream(), GroupNameLimitStream()]
}

function ParseNamedGroupBody() {
	return [
		GroupBodyStream()
		// TODO: SECOND ITEM - the "main" chooser! ADD IT (this is the recursion spot)
	]
}

function parseInsideNamedGroup() {
	let i = 0
	return function () {
		return i++ === 0 ? ParseGroupName() : ParseNamedGroupBody()
	}
}

export function HandleNamedGroup(input: IOwnedStream<string>): IStreamChoice {
	input.next() // {
	return [new NamedGroupStream(), parseInsideNamedGroup(), GroupLimitStream()]
}
