import type {
	ICommonStream,
	INode,
	IOwnedStream,
	IPeekable,
	IPushable
} from "../../../interfaces.js"
import { TableHandler } from "../../../objects.js"
import { expectKind, tryReviveChild } from "../../../objects/Error.js"
import { BasicHash } from "../../../objects/HashMap.js"
import { SingleNodeStream } from "../../../objects/Stream.js"
import {
	CachedTokenStream,
	SingletonWrapperStream
} from "../../../samples/Stream.js"
import { ObjectMap } from "../../../samples/TerminalMap.js"
import { consumeSingletonRevivables } from "../../../utils/Stream.js"
import { HandleEscaped, HandleRangeBoundaryEscaped } from "../Escaped.js"
import { ClassRange, ClassRangeBoundary, ClassUnit, Temp } from "../Nodes.js"
import { HandleSingleChar } from "../SingleChar.js"

const HyphenStream = CachedTokenStream(Temp.Hyphen)
const ClassUnitStream = SingletonWrapperStream(ClassUnit)
const RangeBoundaryStream = SingletonWrapperStream(ClassRangeBoundary)

const expectRangeBoundary = expectKind(ClassRangeBoundary)
const expectHyphen = expectKind(Temp.Hyphen)

class ClassRangeStream extends SingleNodeStream<INode> {
	private classRange: ClassRange

	private updateCurr() {
		this.curr = this.classRange
	}

	private readBoundary() {
		expectRangeBoundary(this.resource!)
		return this.readNextItem()
	}

	private readHyphen() {
		expectHyphen(this.resource!)
		return this.readNextItem()
	}

	private readNextItem() {
		const unit = this.resource!.curr as INode
		this.resource!.next()
		return unit
	}

	baseInit(): void {
		const from = this.readBoundary() // the child Stream dies
		tryReviveChild(this) // needs to be renewed
		this.readHyphen()
		tryReviveChild(this) // needs to be renewed
		const to = this.readBoundary()
		this.classRange = new ClassRange(from, to)
		this.updateCurr()
	}
}

const RangeBoundaryHandler = TableHandler<
	IOwnedStream<string>,
	ICommonStream<INode>
>(
	new BasicHash(
		ObjectMap(
			{
				"\\": HandleRangeBoundaryEscaped
			},
			HandleSingleChar
		)
	)
)

function HandleRangeBoundary(input: IOwnedStream<string>) {
	return [RangeBoundaryStream(), RangeBoundaryHandler(input)]
}

function HandleHyphen(input: IOwnedStream<string>) {
	input.next() // -
	return [HyphenStream()]
}

function HandleUnit(input: IOwnedStream<string>) {
	return [ClassUnitStream(), ClassUnitHandler(input)]
}

function HandleBoundaryOrHyphen(input: IOwnedStream<string>) {
	return (input.curr === "-" ? HandleHyphen : HandleRangeBoundary)(input)
}

function HandleClassRange(input: IOwnedStream<string>) {
	return [new ClassRangeStream(), HandleBoundaryOrHyphen]
}

const ClassUnitHandler = TableHandler<
	IOwnedStream<string>,
	ICommonStream<INode>
>(
	new BasicHash(
		ObjectMap(
			{
				"\\": HandleEscaped
			},
			HandleSingleChar
		)
	)
)

function isRangeAhead(input: IOwnedStream<string> & IPeekable<string>) {
	const peekLength = input.curr === "\\" ? 2 : 1
	return input.peek(peekLength) === "-" // \?-? [peekLength == 2], or ?-? [peekLength == 1]
}

function ClassElementHandler(input: IOwnedStream<string> & IPeekable<string>) {
	return [isRangeAhead(input) ? HandleClassRange : HandleUnit]
}

export abstract class ClassStream<
	T extends INode & IPushable<INode>
> extends SingleNodeStream<INode> {
	protected abstract spawnTarget(): T

	baseInit(): void {
		this.curr = consumeSingletonRevivables(this, this.spawnTarget())
	}
}

export function HandleClass<T extends INode & IPushable<INode>>(
	ClassKind: () => ClassStream<T>
) {
	return function (input: IOwnedStream<string> & IPeekable<string>) {
		return [ClassKind(), ClassElementHandler]
	}
}
