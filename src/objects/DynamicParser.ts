import type { Summat } from "@hgargg-0710/summat.ts"
import type {
	ICommonStream,
	ICompositeStream,
	IErrorDataMaker,
	IInputStream,
	ILinkedStream
} from "../interfaces.js"
import type { IParse, IParseState } from "../interfaces/DynamicParser.js"
import { Initializable } from "./Initializer.js"
import { IdentityStream } from "./Stream.js"

class ParsedStream<InType = any, FinalType = any, InitType = any>
	extends IdentityStream<FinalType, []>
	implements ILinkedStream<FinalType>
{
	next() {
		super.next()
		this.parseInstance.maybeUpdate()
	}

	free(): void {}

	constructor(
		private readonly parseInstance: Parse<InType, FinalType, InitType>
	) {
		super(parseInstance.workStream)
	}
}

const parseInitializer = {
	init<InitType = any>(target: Parse, input?: InitType, state?: Summat) {
		if (input) target.setInput(input)
		if (state) target.setState(state)
		if (target.isSetupReady()) target.setupStreams()
	}
}

class Parse<InType = any, FinalType = any, InitType = any>
	extends Initializable<[InitType, Summat]>
	implements IParse<FinalType, InitType>
{
	private didUpdate = false
	private input?: InitType
	private _state?: IParseState<FinalType, InitType>

	get state() {
		return this._state!
	}

	private createState(
		preState: Summat = {}
	): IParseState<FinalType, InitType> {
		return {
			...preState,
			parse: this,
			errData: this.errDataMaker(this.inputStream, this.input!)
		}
	}

	private onUpdate() {
		this.didUpdate = false
		this.workStream.renewResource()
	}

	protected get initializer() {
		return parseInitializer
	}

	get streams() {
		return this.workStream.streams
	}

	setInput(input: InitType) {
		this.input = input
	}

	setState(preState: Summat) {
		this._state = this.createState(preState)
		return this
	}

	isSetupReady() {
		return !!this.input && !!this._state
	}

	setupStreams() {
		this.inputStream.init(this.input)
		this.workStream.init(this.inputStream)
		this.workStream.setState(this.state)
	}

	renewStream(stream: ILinkedStream): boolean {
		return this.workStream.renewStream(stream)
	}

	update() {
		this.didUpdate = true
	}

	maybeUpdate() {
		if (this.didUpdate) this.onUpdate()
	}

	constructor(
		public readonly workStream: ICompositeStream<FinalType>,
		private readonly inputStream: IInputStream<InType, InitType>,
		private readonly errDataMaker: IErrorDataMaker<InType, InitType>
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
	workStream: () => ICompositeStream<FinalType>,
	inputStream: () => IInputStream<InType, InitType>,
	errDataMaker: IErrorDataMaker<InType, InitType>
) {
	const getParse = () => new Parse(workStream(), inputStream(), errDataMaker)
	return function (
		input: InitType,
		state?: Summat
	): ICommonStream<FinalType> {
		return new ParsedStream(getParse().init(input, state))
	}
}
