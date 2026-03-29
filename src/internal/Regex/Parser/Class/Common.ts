import type {
	IMarkerHaving,
	INode,
	IOwnedStream,
	IResourcefulStream
} from "../../../../interfaces.js"
import { NodeStream } from "../../../../modules/Stream/objects/concrete.js"
import { MarkerLocator } from "../../../../modules/Stream/objects/Locator.js"
import { tryReviveChild } from "../../../../objects/Error.js"
import { next } from "../../../../utils/Stream.js"
import { CLASS_END_MARKER } from "../Contract.js"
import { ClassRange, Temp } from "../Nodes.js"
import { ClassElementSequenceChooser } from "./ClassElementSequenceChooser.js"

class ClassElementJoinerStream extends NodeStream<INode> {
	private readonly classEndingLocator =
		MarkerLocator.downwards(CLASS_END_MARKER)

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
