import { DelegateStream } from "./DelegateStream.js"
import type { IStream } from "../interfaces.js"
import type { IOwnedStream } from "../interfaces/OwnedStream.js"

export abstract class OwnedStream<Type = any>
	extends DelegateStream<Type>
	implements IOwnedStream<Type>
{
	owner?: IStream

	claimBy(owner: IStream) {
		this.owner = owner
	}
}
