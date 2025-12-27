import { object } from "@hgargg-0710/one"
import type { Summat } from "@hgargg-0710/summat.ts"
import assert from "assert"
import type {
	IOwnedStream,
	IParseStream,
	IParseStreamMaker
} from "../interfaces.js"
import { ConcatStream } from "./Stream.js"

class StateList {
	private readonly states: IPropertiesGetterState[]
	private i = 0

	private withinBounds(index: number) {
		return index % this.states.length
	}

	advance() {
		++this.i
	}

	private read(at: number) {
		return this.states[this.withinBounds(at)]
	}

	readCurr() {
		return this.read(this.i)
	}

	readNext() {
		return this.read(this.i + 1)
	}

	constructor(...states: IPropertiesGetterState[]) {
		assert(states.length)
		this.states = states
	}
}

class PropertiesGetter {
	private currState: IPropertiesGetterState

	get() {
		const properties = this.currState.get()
		this.currState = this.currState.nextState(this.states)
		this.states.advance()
		return properties
	}

	constructor(private readonly states: StateList) {
		this.currState = states.readCurr()
	}
}

interface IPropertiesGetterState {
	get(): Summat
	nextState(states: StateList): IPropertiesGetterState
}

abstract class CommonPropertiesGetterState implements IPropertiesGetterState {
	get(): Summat {
		return this.propGetter()
	}

	abstract nextState(states: StateList): IPropertiesGetterState

	constructor(private readonly propGetter: () => Summat) {}
}

class LoopPropertiesGetterState extends CommonPropertiesGetterState {
	nextState(): IPropertiesGetterState {
		return this
	}
}

class NextPropertiesGetterState extends CommonPropertiesGetterState {
	nextState(states: StateList): IPropertiesGetterState {
		return states.readNext()
	}
}

class ParseConcatStream<T = any, Init = any> extends ConcatStream<
	T,
	IParseStream<T>
> {
	private readonly lastStreamCommonStateExtractor = new PropertiesGetter(
		new StateList(
			new NextPropertiesGetterState(() => this.getState()),
			new LoopPropertiesGetterState(() =>
				this.lastCommonStateExtractDefined()
			)
		)
	)

	private readonly filterCommonState = object.withoutProperties(
		"parse",
		"errData"
	)

	private lastStream() {
		return this.rawStreamAt(-1)
	}

	private lastCommonStateExtractDefined(): Summat {
		return this.filterCommonState(this.lastStream().state)
	}

	private lastCommonStateExtract(): Summat {
		return this.lastStreamCommonStateExtractor.get()
	}

	constructor(
		input: Init,
		private readonly getState: () => Summat = object.empty,
		streamMakers: IParseStreamMaker<Init, T>[]
	) {
		super(
			...streamMakers.map(
				(maker) => () =>
					maker(() => this.lastCommonStateExtract())(input)
			)
		)
	}
}

// ! PRE-DOC: *important* - this is ONE OF THE TWO abstractions needed for proper utilisation
// ! of lazy parsing in practical contexts:
// * 	Specifically, oftentimes, in common formats (ex: XML, JSON, HTML, etc), one has a "root"
// * 	element, inside of which the entirety of the document's contents are located. This poses
// * 	a problem for lazy parsing, SINCE, the current implementation of 'ParseStream' REQUIRES
// * 	one to perform EITHER: 1. a PARTIAL parse; 2. a FULL parse; This, in particular, means
// * 	that one requires a way to parse INDIVIDUAL "preliminary" pieces at the top, that would
// * 	include the "closing/opening" parts of a "Root Element".
// %	THIS IS THE 'ROOT ELEMENT' PARSING PROBLEM
// *	There are two types of solutions, and this is one;
// ! 	One CAN use an arbitrarily-deep/long concatenation-parser of "incomplete" parsers (see below; a part of 'Parser.ts'),
// 			It's more complex and better for seriously *nasty* cases, when you can't reliably predict
// 			the "artificial" depth, and therefore, efficiently break up the parsing process. It's
// 			very commonly used for Event-Based XML parsers (though it's not implemented quite the
// 			same way...).
// 			NOTE: in this version, the "tail" parsers must ALSO be present (i.e., one must SOMEHOW
// 			keep track of them...)
// * 	OR (this solution), one can combine a finite number of "incomplete" parsers, with a respective
// * 	"tail" parser, which'd "clean up" the "open" tag/bracket/etc, by "skip(...)"-ping the closing
// * 	tag/bracket/etc. It does nothing, merely serves to validate the integrity of a given open-close
// * 	piece (in languages such YAML, it's empty and does nothing);
// ^ 	VITAL: put this into the library's documentation (the Guide-s, specifically...)
// 			To use the library effectively for large datasets, the user must UNDERSTAND
// 			the existence of this specific problem, and its solutions.
// ^ 	VITAL NOTE: this CAN'T (typically) be nested;
// 			Important, since 'ParseStream' *does* properly support it (somewhat confusingly);
export function Finite<Init = any, Out = any>(
	streamMakers: IParseStreamMaker<Init, Out>[]
) {
	return function (getState?: () => Summat) {
		return function (input: Init): IOwnedStream<Out> & Iterable<Out> {
			return new ParseConcatStream(input, getState, streamMakers)
		}
	}
}

export function Nested<Init = any, Out = any>(
	open: IParseStreamMaker<Init, Out>,
	between: IParseStreamMaker<Init, Out>[],
	close: IParseStreamMaker<Init, Out>
) {
	return [open, ...between, close]
}
