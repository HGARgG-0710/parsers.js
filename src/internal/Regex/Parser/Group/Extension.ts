import type {
	IOwnedStream,
	IRawStreamArray,
	IStreamChooser,
	IStreamPredicate
} from "../../../../interfaces.js"
import { Parametrized, Regex, TableHandler } from "../../../../objects.js"
import { skip } from "../../../../objects/Error.js"
import { ObjectMap } from "../../../../samples/TerminalMap.js"
import { GroupLimitStream } from "../Group.js"
import { BasicPeekHash } from "../Parser.js"
import { HandleSingleChar } from "../SingleChar.js"
import { CustomExtensionGroups } from "./Extensions/Custom.js"
import { IgnoreCaseExtensionGroup } from "./Extensions/IgnoreCase.js"
import { NoCaptureExtensionGroup } from "./Extensions/NoCapture.js"

const skipExtension = skip("#")

export function ExtensionGroupLimitStream(from: IStreamPredicate<string>) {
	return GroupLimitStream((input) => {
		skipExtension(input) // #
		return from(input)
	})
}

export const HandleExtensionGroup = new Parametrized(
	(extensions: Regex.Extension[]) =>
		TableHandler<IOwnedStream, IRawStreamArray>(
			new BasicPeekHash(
				ObjectMap<IStreamChooser>(
					{
						...CustomExtensionGroups.for(extensions),
						i: IgnoreCaseExtensionGroup.for(extensions),
						n: NoCaptureExtensionGroup.for(extensions)
					},
					HandleSingleChar
				)
			)
		)
)
