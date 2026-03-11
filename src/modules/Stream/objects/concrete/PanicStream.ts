import type { IErrorData } from "../../../../interfaces.js"
import { isError } from "../../../../utils.js"
import { finish } from "../../../../utils/Stream.js"
import type { IOwnedStream } from "../../interfaces/OwnedStream.js"
import type { IErrorObjectFactory } from "../../interfaces/PanicStream.js"
import type { ISubProxyStream } from "../../interfaces/ProxyStream.js"
import { ErrorStream } from "./ErrorStream.js"

export class PanicStream<T = any, ErrType = any> extends ErrorStream<
	T | ErrType
> {
	private readonly onNewError: PanicStreamOnNewError<T, ErrType>
	private readonly noError: PanicStreamNoError<T, ErrType>
	private isErrState: IPanicStreamState<T, ErrType>
	private currErrData: IErrorData

	// ! pre-doc: this is NOT intended as a hook, though it can (sometimes) be used as one
	protected override onSuccess(): void {
		this.transitionNoError()
	}

	override get curr() {
		const curr = this.isErrState.curr
		this.isErrState = this.isErrState.nextState()
		return curr
	}

	// ! pre-doc: this is a HOOK - the user CAN override it [and should - if their case demands it];
	protected getChild(): IOwnedStream {
		return this.resource!
	}

	// ! pre-doc: this is ALSO a HOOK, since the user MAY want to OVERRIDE this
	// [for instance - when terminating THE WHOLE CHOOSER due to a single error,
	// this STILL allows for the child to be "renewed"]
	protected panic() {
		finish(this.getChild())
	}

	// ! pre-doc: this is ALSO a hook... [using the Template Method Pattern]
	protected registerError() {
		this.state.errors.push(this.errData.toError())
	}

	private transitionNoError() {
		this.isErrState = this.noError
	}

	private transitionState() {
		this.isErrState = this.onNewError
	}

	private setErrData(errData: IErrorData) {
		this.currErrData = errData
	}

	get errData() {
		return this.currErrData
	}

	// Template Method, DO NOT TOUCH
	private handleErrData(errData: IErrorData) {
		this.setErrData(errData)
		this.transitionState()
		this.panic()
		this.registerError()
	}

	// ! pre-doc: THIS IS A HOOK [can be overriden]
	// * By default, one is expecting ALL the thrown 'Error's to be NON-RECOVERABLE.
	//  	In particular, the library (typically) throws errors in situations related to
	//  	INCORRECT FRAMEWORK USAGE, and NOT the matters related to syntax-errors during
	//  	parsing. In conclusion, unless the user wants to enable RECOVERY from the 'Error'
	//  	objects thrown AS WELL (which is, in general, impossible, unless they METICULOUSLY
	//  	try to separate Error-Types into "recoverable" and "non-recoverable", 
	//  	which is a lot of work), they are probably better off *not* touching this specific 
	//  	hook at all (similarly to much of the library's defaults, since it's designed to 
	//  	support a plethora of varying approaches out-of-the-box). 
	protected handleCommon(error: Error) {
		throw error
	}

	// ! pre-doc: this is NOT intended for overriding [Template Method Design Pattern]
	// * 	ALSO: it is intended that ONLY the 'IErrData' objects be thrown WHENEVER we are
	protected errHandler(errLike: Error | IErrorData): void {
		if (isError(errLike)) this.handleCommon(errLike)
		else this.handleErrData(errLike)
	}

	constructor(
		delegate: ISubProxyStream<T | ErrType>,
		errObjectFactory: IErrorObjectFactory<ErrType>
	) {
		super(delegate)
		this.onNewError = new PanicStreamOnNewError(errObjectFactory, this)
		this.noError = new PanicStreamNoError<T, ErrType>(() => super.curr)
		this.isErrState = this.noError
	}
}

interface IPanicStreamState<T = any, ErrType = any> {
	get curr(): T | ErrType
	nextState(): IPanicStreamState<T, ErrType>
}

class PanicStreamNoError<T = any, ErrType = any>
	implements IPanicStreamState<T, ErrType>
{
	get curr(): T | ErrType {
		return this.defaultCurr()
	}

	nextState(): IPanicStreamState<T, ErrType> {
		return this
	}

	constructor(private readonly defaultCurr: () => T | ErrType) {}
}

class PanicStreamOnNewError<T = any, ErrType = any>
	implements IPanicStreamState<T, ErrType>
{
	private readonly onOld: PanicStreamOnOldError<T, ErrType>

	get curr(): T | ErrType {
		const newCurr = this.errObjectFactory.getErrorObject(this.owner.errData)
		this.onOld.setErrObject(newCurr)
		return newCurr
	}

	nextState(): IPanicStreamState<T, ErrType> {
		return this.onOld
	}

	constructor(
		private readonly errObjectFactory: IErrorObjectFactory<ErrType>,
		private readonly owner: PanicStream<T, ErrType>
	) {
		this.onOld = new PanicStreamOnOldError()
	}
}

class PanicStreamOnOldError<T = any, ErrType = any>
	implements IPanicStreamState<T, ErrType>
{
	private errObject: ErrType

	setErrObject(errObject: ErrType) {
		this.errObject = errObject
	}

	get curr(): T | ErrType {
		return this.errObject
	}

	nextState(): IPanicStreamState<T, ErrType> {
		return this
	}
}
