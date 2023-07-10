import flatten from 'array-flatten';

class Route {
	/**
	 * @param {String} path - the route path
	 * @param {Function[]} handles - the route handles (req, res, next) => {}
	 * @constructor
	 * */
	constructor(path, ...handles) {
		this.path = path;
		this.stack = [];

		this.push(handles);
	}

	handle(handles) {
		handles = flatten(handles);

		for (let i = 0; i < handles.length; i++) {
			const handle = handles[i];

			if (typeof handle !== 'function') {
				const type = handle.toString();
				const msg = 'Route requires callback functions but got a ' + type;
				throw new Error(msg);
			}
		}

		return handles;
	}

	push(handles) {
		handles = this.handle(handles);

		this.stack = this.stack.concat(handles);
	}

	unshift(handles) {
		handles = this.handle(handles);

		this.stack = handles.concat(this.stack);
	}
}

export default Route;
