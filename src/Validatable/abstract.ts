import { FlushablePattern } from "../Pattern/abstract.js"
import type { Resulting } from "../Pattern/interfaces.js"
import type { ValidationOutput } from "./interfaces.js"

import { validation } from "../constants.js"
const { ValidationFailed } = validation.ValidatablePattern

// * Note: due to the way this is defined, for validity analysis, it's better to use 'analyzeValidity' util than just '!!this.result[0]':
// * 		it returns an empty array both when '!.result[1].length' and when '!!result[0]';

export abstract class FlushableValidatable<Type = any>
	extends FlushablePattern<Type>
	implements Resulting<ValidationOutput<Type>>
{
	result: ValidationOutput<Type>
	flush(): void {
		this.result = ValidationFailed<any>([])
	}
}
