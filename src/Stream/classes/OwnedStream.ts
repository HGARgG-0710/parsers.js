import { DelegateStream } from "../../internal/DelegateStream.js"
import type { IStream } from "../interfaces.js"
import type { IOwnedStream } from "../interfaces/OwnedStream.js"

export class OwnedStream<Type = any>
	extends DelegateStream<Type>
	implements IOwnedStream<Type>
{
	owner?: IStream<Type>

	claimBy(owner: IStream<Type>) {
		this.owner = owner
	}
}
