import type { array } from "@hgargg-0710/one"
import type { type } from "@hgargg-0710/one"

import { boolean, array as _array } from "@hgargg-0710/one"
const { T } = boolean
const { isPair: _isPair } = _array

export const isPair = <KeyType = any, ValueType = any>(
	keyPred?: type.TypePredicate<KeyType>,
	valuePred?: type.TypePredicate<ValueType>
) => {
	const [kp, vp] = [keyPred, valuePred].map((x) => x || T)
	return (x: any): x is array.Pair<KeyType, ValueType> =>
		_isPair<KeyType, ValueType>(x) && kp(x[0]) && vp(x[1])
}
