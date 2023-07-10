import SMTP from 'smtp-server'
import parser from 'mailparser'
const SMTPServer=SMTP.SMTPServer
const simpleParser=parser.simpleParser

const NodeMailerServer={
    init:(data)=>{
        const server = new SMTPServer({
            //size: 1024, // allow messages up to 1 kb
            secure:false,
            //name:data.host,
            onAuth(auth, session, callback) {
                /*if (auth.username !== "abc" || auth.password !== "def") {
                    return callback(new Error("Invalid username or password"));
                }*/
                callback(null, { user: 123 });
            },
            disabledCommands:['STARTTLS'],
            onData(stream, session, callback) {
                //stream.pipe(process.stdout); // print message to console
                stream.on('data',(data)=>{
                    const message=simpleParser(data.toString(),{},(err,message)=>{
                        console.log('message ', message)
                    })
                })
                stream.on("end", callback);
            }
        });
        server.listen(data.port,'localhost',()=>{
            console.log('The smtp is created on port:', data.port, 'host',data.host)
        })
        server.on("error", err => {
            console.log("Error %s", err.message);
        });
    }
}
export default NodeMailerServer
