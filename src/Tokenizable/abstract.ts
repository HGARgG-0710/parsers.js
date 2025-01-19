import type { Resulting } from "../Pattern/interfaces.js"
import type { TokenizationResult } from "./interfaces.js"

import { FlushablePattern } from "../Pattern/abstract.js"

export abstract class FlushableTokenizable<Type = any, OutType = any>
	extends FlushablePattern<Type>
	implements Resulting<TokenizationResult<Type, OutType>>
{
	result: TokenizationResult<Type, OutType>
	flush(): void {
		this.result = []
	}
}
