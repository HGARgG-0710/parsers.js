import { AutoMap } from "../objects.js"

export class Parametrized<Param = any, T = any> {
	private readonly byParam = new AutoMap<Param, T>((param) =>
		this.targetGetter(param)
	)

	for(param: Param) {
		return this.byParam.get(param)
	}

	constructor(private readonly targetGetter: (param: Param) => T) {}
}
