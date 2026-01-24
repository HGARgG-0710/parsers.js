import type {
	ICommonStream,
	INode,
	IOwnedStream,
	IRawStreamArray
} from "../../../../interfaces.js"
import { StatefulStreamChooser } from "../../../../modules/Stream/objects/Chooser.js"
import { TableHandler } from "../../../../objects.js"
import { BasicHash } from "../../../../objects/HashMap.js"
import {
	CachedTokenStream,
	DefaultChooser,
	SingletonWrapperStream
} from "../../../../samples/Stream.js"
import { ObjectMap } from "../../../../samples/TerminalMap.js"
import {
	canBeRangeBoundaryStart,
	HandleEscaped,
	HandleRangeBoundaryEscaped
} from "../Escaped.js"
import { ClassUnit, Temp } from "../Nodes.js"
import { HandleSingleChar } from "../SingleChar.js"
import { isCurrHyphen } from "../Utils/limits.js"

const ClassUnitStream = SingletonWrapperStream(ClassUnit)
const HyphenStream = CachedTokenStream(Temp.Hyphen)
const HandleHyphen = DefaultChooser(HyphenStream)

export class ClassElementSequenceChooser extends StatefulStreamChooser<INode> {
	static readonly instance = new ClassElementSequenceChooser()

	private readonly startState = new SequenceChooser.StartState()
	private readonly firstItemGiven = new SequenceChooser.FirstItemGivenState(
		this.startState
	)
	private readonly hyphenSeen = new SequenceChooser.HyphenSeenState()

	private currState: SequenceChooser.IState = this.startState

	private applyState(input: IOwnedStream<string>) {
		return this.currState.choose(input)
	}

	private acceptNextState(
		input: IOwnedStream<string>
	): IRawStreamArray<INode> {
		const newState = this.currState.futureState(input)
		const result = this.applyState(input)
		this.currState = newState
		return result
	}

	private regressToPrevState(input: IOwnedStream<string>) {
		this.currState = this.currState.prevState(input)
		return this.applyState(input)
	}

	override choose(input: IOwnedStream<string>): IRawStreamArray<INode> {
		return this.currState.shouldAdvance(input)
			? this.acceptNextState(input)
			: this.regressToPrevState(input)
	}

	reset() {
		this.currState = this.startState
		return this
	}

	constructor() {
		super()
		this.startState.setNextState(this.firstItemGiven)
		this.firstItemGiven.setNextState(this.hyphenSeen)
		this.hyphenSeen.setNextState(this.startState)
	}
}

namespace SequenceChooser {
	export interface IState {
		choose(input: IOwnedStream<string>): IRawStreamArray<INode>
		shouldAdvance(input: IOwnedStream<string>): boolean
		prevState(input: IOwnedStream<string>): IState
		futureState(input: IOwnedStream<string>): IState
		setNextState(state: IState): void
	}

	abstract class BaseState implements IState {
		private next: IState

		abstract choose(input: IOwnedStream<string>): IRawStreamArray<INode>
		abstract shouldAdvance(input: IOwnedStream<string>): boolean

		prevState(input: IOwnedStream<string>): IState {
			return this
		}

		futureState(input: IOwnedStream<string>): IState {
			return this.next
		}

		setNextState(next: IState) {
			this.next = next
		}
	}

	export class StartState extends BaseState {
		choose(input: IOwnedStream<string>): IRawStreamArray<INode> {
			return HandleUnit(input)
		}

		shouldAdvance(input: IOwnedStream<string>): boolean {
			return canBeRangeBoundaryStart(input.curr)
		}
	}

	export class FirstItemGivenState extends BaseState {
		choose(input: IOwnedStream<string>): IRawStreamArray<INode> {
			return HandleHyphen()
		}

		override prevState(input: IOwnedStream<string>): IState {
			return this.prev
		}

		shouldAdvance(input: IOwnedStream<string>): boolean {
			return isCurrHyphen(input)
		}

		constructor(private readonly prev: IState) {
			super()
		}
	}

	export class HyphenSeenState extends BaseState {
		shouldAdvance(input: IOwnedStream<string>): boolean {
			return true
		}

		choose(input: IOwnedStream<string>): IRawStreamArray<INode> {
			return [RangeBoundaryHandler(input)]
		}
	}
}

function HandleUnit(input: IOwnedStream<string>) {
	return [ClassUnitStream(), ClassUnitHandler(input)]
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
