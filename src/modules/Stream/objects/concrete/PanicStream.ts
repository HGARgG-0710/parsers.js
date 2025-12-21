import { finish } from "../../../../utils/Stream.js"
import type { IOwnedStream } from "../../interfaces/OwnedStream.js"
import type { IErrObjectFactory } from "../../interfaces/PanicStream.js"
import type { ISubProxyStream } from "../../interfaces/ProxyStream.js"
import { ErrorStream } from "./ErrorStream.js"

export class PanicStream<T = any, ErrType = any> extends ErrorStream<
	T | ErrType
> {
	private readonly onNewError: PanicStreamOnNewError<T, ErrType>
	private readonly noError: PanicStreamNoError<T, ErrType>
	private isErrState: IPanicStreamState<T, ErrType>

	// ! pre-doc: this is NOT intended as a hook, though it can (sometimes) be used as one
	protected onSuccess(): void {
		this.transitionNoError()
	}

	get curr() {
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
	protected exhaustChild() {
		finish(this.getChild())
	}

	// ! pre-doc: this is ALSO a hook... [using the Template Method Pattern]
	protected registerError(err: any) {
		this.state.errors.push(err)
	}

	private transitionNoError() {
		this.isErrState = this.noError
	}

	private transitionError() {
		this.isErrState = this.onNewError
	}

	// ! pre-doc: this is NOT intended for extension;
	protected errHandler(err: any): void {
		this.transitionError()
		this.exhaustChild()
		this.registerError(err)
	}

	constructor(
		delegate: ISubProxyStream<T | ErrType>,
		errObjectFactory: IErrObjectFactory<ErrType>
	) {
		super(delegate)
		this.onNewError = new PanicStreamOnNewError(errObjectFactory)
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
		const newCurr = this.errObjectFactory.getErrObject()
		this.onOld.setErrObject(newCurr)
		return newCurr
	}

	nextState(): IPanicStreamState<T, ErrType> {
		return this.onOld
	}

	constructor(private readonly errObjectFactory: IErrObjectFactory<ErrType>) {
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
