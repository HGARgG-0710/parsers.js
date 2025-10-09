/**
 * This is a class for representing a mutable size 
 * of a collection entity. 
*/
export class Size {
	inc() {
		++this.size
	}

	dec() {
		if (this.size > 0) --this.size
	}

	get() {
		return this.size
	}

	constructor(private size: number = 0) {}
}
