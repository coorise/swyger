class Request{
    /**
     * @param {Socket} socket
     * @param {Route} route
     * @param {Array} args
     * @constructor
     * */
    constructor(socket, { route, args }){
        Object.assign(this, socket.handshake
			, socket.request
			, socket.conn);

        this.socket = socket;
        this.path = route.path;
        this.fullPath = this.path;
		this.ip = this.headers['x-forwarded-for'] || this.address;
		
		this._arguments = [];
		
		for(let i = 0; i < args.length; i++){
            if(typeof args[i] === 'function'){
                this._callback = args[i];
                continue;
            }

            this._arguments.push(args[i]);
        }

        this.params = {};

        if(this._arguments.length === 1 && this._arguments[0] != null && typeof this._arguments === 'object'){
            this.params = this._arguments[0];
        }else{
            this.params = this._arguments.reduce(function (acc, cur, i){
                acc[i] = cur;
                return acc;
            }, {});
        }
    }
    param(name){
        return this.params[name];
    }
}

export default Request;