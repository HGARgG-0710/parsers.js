import type { MultiIndexModifier } from "_src/types/Stream/TreeStream/MultiIndex/MultiIndexModifier.1.js";
import type { MultiIndex } from "../interfaces.js";
import type { MultiIndexModifier } from "./interfaces.js";
import { multiIndexModifierNextLevel, multiIndexModifierPrevLevel, multiIndexModifierResize, multiIndexModifierClear, multiIndexModifierIncLast, multiIndexModifierDecLast, multiIndexModifierExtend } from "./methods.js";


export function MultiIndexModifier(multind: MultiIndex): MultiIndexModifier {
	return {
		multind,
		nextLevel: multiIndexModifierNextLevel,
		prevLevel: multiIndexModifierPrevLevel,
		resize: multiIndexModifierResize,
		clear: multiIndexModifierClear,
		incLast: multiIndexModifierIncLast,
		decLast: multiIndexModifierDecLast,
		extend: multiIndexModifierExtend
	};
}
