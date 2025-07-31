import type { Summat } from "@hgargg-0710/summat.ts"
import type {
	ICompositeStream,
	IInputStream,
	ILinkedStream
} from "../interfaces.js"
import type { IParse, IParseState } from "../interfaces/DynamicParser.js"
import { AttachedStream } from "../modules/Stream/classes/AttachedStream.js"
import { Initializable } from "./Initializer.js"

type IParsedStreamConstructor<
	InType = any,
	FinalType = any,
	InitType = any
> = new (
	parseInstance: Parse<InType, FinalType, InitType>
) => ILinkedStream<FinalType>

let parsedStreamClass: IParsedStreamConstructor | null = null

function BuildParsedStream<InType = any, FinalType = any, InitType = any>() {
	return class
		extends AttachedStream.generic!<FinalType, []>()
		implements ILinkedStream<FinalType>
	{
		protected ["constructor"]: new (
			parseInstance: Parse<InType, FinalType, InitType>
		) => this

		next() {
			super.next()
			this.parseInstance.maybeUpdate()
		}

		copy(): this {
			return new this.constructor(this.parseInstance.copy())
		}

		constructor(
			private readonly parseInstance: Parse<InType, FinalType, InitType>
		) {
			super(parseInstance.workStream)
		}
	} as IParsedStreamConstructor<InType, FinalType, InitType>
}

function ParsedStream<
	InType = any,
	FinalType = any,
	InitType = any
>(): IParsedStreamConstructor<InType, FinalType, InitType> {
	return parsedStreamClass
		? parsedStreamClass
		: (parsedStreamClass = BuildParsedStream<InType, FinalType, InitType>())
}

const parseInitializer = {
	init<InitType = any>(target: Parse, input?: InitType, state?: Summat) {
		if (state) target.setState(state)
		if (input) target.setInput(input)
	}
}

class Parse<InType = any, FinalType = any, InitType = any>
	extends Initializable<[InitType, Summat]>
	implements IParse<FinalType, InitType>
{
	private ["constructor"]: new (
		workStream: ICompositeStream<FinalType>,
		inputStream: IInputStream<InType, InitType>
	) => this

	private didUpdate = false

	private _state: IParseState<FinalType, InitType>

	private set state(newState: IParseState<FinalType, InitType>) {
		this._state = newState
	}

	get state() {
		return this._state
	}

	private createState(
		preState: Summat = {}
	): IParseState<FinalType, InitType> {
		return { ...preState, parse: this }
	}

	private onUpdate() {
		this.didUpdate = false
		this.workStream.renewResource()
	}

	private initInputStream(input: InitType) {
		this.inputStream.init(input)
	}

	private initWorkStream() {
		this.workStream.init(this.inputStream)
	}

	private shareState() {
		this.workStream.setState(this.state)
	}

	protected get initializer() {
		return parseInitializer
	}

	get streams() {
		return this.workStream.streams
	}

	setState(preState: Summat) {
		this.state = this.createState(preState)
	}

	setInput(input: InitType) {
		this.initInputStream(input)
		this.initWorkStream()
		this.shareState()
	}

	update() {
		this.didUpdate = true
	}

	maybeUpdate() {
		if (this.didUpdate) this.onUpdate()
	}

	copy() {
		return new this.constructor(
			this.workStream.copy(),
			this.inputStream.copy()
		)
	}

	constructor(
		public readonly workStream: ICompositeStream<FinalType>,
		private readonly inputStream: IInputStream<InType, InitType>
	) {
		super()
	}
}

/**
 * A function for creation of self-modifying parsers.
 * They are based upon the provided `workStream: ICompositeStream<FinalType>`
 * to serve as the "body" of the parser, and the `inputStream`, as its input.
 *
 * The `inputStream` is being "fed" to the `workStream` via the `.init(inputStream)`
 * method call upon call to the inner function. The `state` is optional to the working
 * of the resulting parser, while the `input` is (depending on the implementation for `inputStream`)
 * is essential.
 *
 * The `input` argument typically represents some form of resource/string-wrapper,
 * or another user-provided source of parsing data (although chaining different
 * parsers is not at all uncommon, and can, in fact, provide great reusability
 * benefits, quite unique to the library's modular approach to treating of
 * parsers and their structure).
 *
 * Note that when a file connection
 * (such a `ReadingSource`, or, in general, an `IResource`), it is the USER'S responsibility
 * to conduct the cleanup.
 *
 * Note that it is also possible to run the result of `DynamicParser` on multiple different
 * `input` objects without requiring to re-create it all anew.
 *
 * The resulting self-modifying parser calls the underlying (initialized) `workStream`
 * until finished, while also permitting the user:
 *
 * 1. access to the global `.state` from within the `ICompositeStream`'s execution
 * 		via the `workStream.setState(state)` method call
 * 2. (modifying) internal access to the underlying `.streams: IStreamArray`
 * 		property of the (global) `ICompositeStream`, containing the 'IRawStream's
 * 		composing the `ICompositeStream` in question,
 * 		via the `this.state.parser.streams`
 * 3. to register the accumulated changes to the `.streams` via the
 * 		internal call to `this.state.parser.update()`
 *
 * Thus, these three capabilities permit the user to modify the parser
 * by means of preserving the information received by parsing appropriate
 * input.
 *
 * The sole rule of the calls to `.update()` is that it can ONLY occurr
 * after the last call to `.next()` HAS been finished. That is to say,
 * the user must plan their grammar in such a fashion so as to ensure
 * that the call to `.update()` is ALWAYS harmonious with the remainder
 * of their last '.next()' call to the `ICompositeStream` as it had been
 * before the `.update()` call in question.
 */
export function DynamicParser<InType = any, FinalType = any, InitType = any>(
	workStream: ICompositeStream<FinalType>,
	inputStream: IInputStream<InType, InitType>
) {
	const parse = new Parse(workStream, inputStream)
	const parsedStream = ParsedStream<InType, FinalType, InitType>()

	return function (
		input: InitType,
		state?: Summat
	): ILinkedStream<FinalType> {
		return new parsedStream(parse.copy().init(input, state))
	}
}
