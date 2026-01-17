import type {
	ICommonStream,
	IMarkerHaving,
	INode,
	IOwnedStream,
	IRawStreamArray,
	IResourcefulStream
} from "../../../../interfaces.js"
import { StatefulStreamChooser } from "../../../../modules/Stream/objects/Chooser.js"
import { NodeStream } from "../../../../modules/Stream/objects/concrete.js"
import { MarkerLocator } from "../../../../modules/Stream/objects/Locator.js"
import { TableHandler } from "../../../../objects.js"
import { tryReviveChild } from "../../../../objects/Error.js"
import { BasicHash } from "../../../../objects/HashMap.js"
import {
	CachedTokenStream,
	DefaultChooser,
	SingletonWrapperStream
} from "../../../../samples/Stream.js"
import { ObjectMap } from "../../../../samples/TerminalMap.js"
import { next } from "../../../../utils/Stream.js"
import {
	canBeRangeBoundaryStart,
	HandleEscaped,
	HandleRangeBoundaryEscaped
} from "../Escaped.js"
import { ClassRange, ClassUnit, Temp } from "../Nodes.js"
import { HandleSingleChar } from "../SingleChar.js"

const HyphenStream = CachedTokenStream(Temp.Hyphen)
const ClassUnitStream = SingletonWrapperStream(ClassUnit)

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

const HandleHyphen = DefaultChooser(HyphenStream)

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

function HandleUnit(input: IOwnedStream<string>) {
	return [ClassUnitStream(), ClassUnitHandler(input)]
}

class ClassElementSequenceChooser extends StatefulStreamChooser<INode> {
	static readonly instance = new ClassElementSequenceChooser()

	private firstItemGiven = false
	private hyphenSeen = false

	private canCurrBeFirstRangeItem(input: IOwnedStream<string>) {
		return canBeRangeBoundaryStart(input.curr)
	}

	private chooseFirstUnit(input: IOwnedStream<string>) {
		if (this.canCurrBeFirstRangeItem(input)) this.firstItemGiven = true
		return HandleUnit(input)
	}

	private chooseUnrelatedUnit(input: IOwnedStream<string>) {
		return HandleUnit(input)
	}

	private chooseHyphen() {
		this.hyphenSeen = true
		return HandleHyphen()
	}

	private tryChooseHyphen(input: IOwnedStream<string>) {
		return input.curr === "-"
			? this.chooseHyphen()
			: this.chooseUnrelatedUnit(input)
	}

	private chooseSecondUnit(input: IOwnedStream<string>) {
		this.reset()
		return [RangeBoundaryHandler(input)]
	}

	override choose(input: IOwnedStream<string>): IRawStreamArray<INode> {
		return this.firstItemGiven
			? this.hyphenSeen
				? this.chooseSecondUnit(input)
				: this.tryChooseHyphen(input)
			: this.chooseFirstUnit(input)
	}

	reset() {
		this.firstItemGiven = false
		this.hyphenSeen = false
		return this
	}
}

class ClassElementJoinerStream extends NodeStream<INode> {
	private readonly classEndingLocator = MarkerLocator.downwards("classEnd")

	private readNextItem() {
		return next(this.resource!) as INode
	}

	private isRange() {
		return Temp.Hyphen.is(this.resource!.curr)
	}

	private parseRange(fromNode: INode) {
		this.readNextItem() // skip Hyphen
		tryReviveChild(this) // needs to be renewed
		const toNode = this.readNextItem() // get the second range boundary
		return new ClassRange(fromNode, toNode)
	}

	private pickOutputNode() {
		const from = this.readNextItem() // the child Stream dies
		tryReviveChild(this)
		return this.isRange() ? this.parseRange(from) : from
	}

	private baseNextIter() {
		this.curr = this.pickOutputNode()
	}

	// ! PRE-DOC [internal - vital]: CONTRACT:
	// * 	1. The user of 'ClassElementJoinerStream' MUST provide
	//  		a 'MarkerStream' BELOW the 'ClassElementJoinerStream',
	//  		but DIRECTLY ABOVE the stream that DEFINES the '.isCurrEnd()'
	//  		[and, therefore, '.isEnd'] of the current class (and, therefore,
	//  		of the 'ClassElementJoinerStream').
	// * 	2. SAID 'MarkerStream' MUST have the marker of "classEnd" (a string literal),
	//  		for otherwise it WILL NOT be recognized.
	override isCurrEnd(): boolean {
		return (
			this.classEndingLocator.locate(this)! as IMarkerHaving &
				IResourcefulStream
		).resource!.isCurrEnd()
	}

	override baseInit(): void {
		this.baseNextIter()
	}

	override next(): void {
		if (this.isCurrEnd()) this.endStream()
		else this.baseNextIter()
	}
}

export function HandleClassElements(input: IOwnedStream<string>) {
	return [
		new ClassElementJoinerStream(),
		ClassElementSequenceChooser.instance.reset()
	]
}
