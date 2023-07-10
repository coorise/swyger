
import {eachSeries} from 'async';
import flatten from 'array-flatten';

const debug = require('debug')('socket.io-router');
const error = require('debug')('socket.io-router:error');

import Request from './Request';
import Response from './Response';
import Route from './Route';

class Router {
	constructor() {
		this.stack = [];
		this.modules = [];

		const synonyms = [
			'all',
			'get',
			'post',
			'put',
			'head',
			'delete',
			'options',
			'search'
		];

		for (let i = 0; i < synonyms.length; i++) {
			this[synonyms[i]] = function () {
				return this.use(...arguments);
			}
		}
	}

	/**
	 * Creates new instance of Route and push it to stack]
	 * @param {String|Function} path - the route path
	 * @param {Function[]} handles - the route handles (req, res, next) => {}
	 * @public
	 * */
	use(path, ...handles) {
		if (typeof path === 'function') {
			/* If path is function that we should attach it for all requests */
			this.modules.push(path);
		} else {
			/* Transform path to this template /${1}/${2}/..., prepend one "/", remove repeats slashes and last if exist*/
			path = path.replace(/\/?(.*)/i, '/$1').replace(/\/{2,}/ig, '/').replace(/^(.+)\/+$/i, '$1');

			if (
				handles.length === 1
				&& handles[0] instanceof Router
			) {
				return handles[0].stack.forEach(route => {
					this.use(path + route.path, route.handlers);
				});
			}

			this.stack.push(new Route(path, ...handles));
		}
	}

	/**
	 * Find prepends funstions in stack (routes with path includes '/*')
	 * @param {Route[]} stack
	 * @return {Route[]}
	 * @private
	 * */
	prepend(stack) {
		stack = stack.reverse();

		for (let i = 0; i < stack.length; i++) {
			if (stack[i].path.indexOf('/*') !== -1) {
				for (let j = 0; j < stack.length; j++) {
					if (
						stack[j].path.indexOf('/*') === -1
						&& stack[j].path.indexOf(stack[i].path.replace('/*', '')) === 0
					) {
						debug('unshift new functions from %s to %s', stack[i].path, stack[j].path);
						stack[j].unshift(stack[i].stack);
					}
				}

				stack.splice(i, 1);
				--i;
			}
		}

		return stack;
	}

	/**
	 * Handle all socket requests
	 * @param {Route} route
	 * @param {Socket} socket
	 * @private
	 * */
	_handle_request(route, socket) {
		const self = this;

		socket.on(route.path, function () {
			const req = new Request(socket, {route, args: Array.from(arguments)});
			const res = new Response(socket, {args: Array.from(arguments)});

			/* Add out modules to req and res, next function is empty */
			self.modules.forEach((module) => {
				module(req, res, () => {
				});
			});

			eachSeries(route.stack, (handle, next) => {
				try {
					handle(req, res, next);
				} catch (e) {
					error('catch error: %O', e);
					next(e);
				}
			}, (err) => {
				if (err) {
					return res.error(err);
				}
			});
		});
	}

	/**
	 * Middleware for socket.io, io.use(router.handle())
	 * @public
	 * */
	handle() {
		this.stack = this.prepend(this.stack);

		this.stack.forEach((route) => {
			debug('new path %s', route.path);
		});

		/* middleware to each socket user */
		return function (socket, next) {
			for (let i = 0; i < this.stack.length; i++) {
				const route = this.stack[i];

				this._handle_request(route, socket);
			}

			next();
		}.bind(this)
	}
}

/**
 * Express Router call without "new" constructor therefore we use _wrapper to call Router()
 * */
function _wrapper() {
	return new Router();
}

export default _wrapper;