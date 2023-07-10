class Response{
    /**
     * @param {Socket} socket
     * @param {Array} args
     * @constructor
     * */
    constructor(socket, { args }){
        const _io = socket.client.server;
        
        this.emit = _io.emit.bind(_io);
        this.to = _io.to.bind(_io);
        this.in = this.to;
		
        this._callback = () => {};
		
		for(let i = 0; i < args.length; i++){
            if(typeof args[i] === 'function'){
                this._callback = args[i];
            }
        }
    }
	status(status) {
		const self = this;
		
		if (status >= 400) {
			self.send = self.error;
		}
		
		return self;
	}
    end(err, data){
        return this._callback(err, data);
    }
    send(data){
        return this.end(null, data);
    }
    error(err){
        return this.end(err);
    }
}

export default Response;