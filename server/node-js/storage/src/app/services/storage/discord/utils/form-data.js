import {getBufferToDiscord} from "../api";

const formData=(form,file)=>{
    getBufferToDiscord()
    form.append(file?.name?.replace(file?.extension,''), fs.readFileSync('./path/to/file1.pdf'), {
        filename: (file?.path+'/'+file?.name).replace(/\//g,'%'),
        contentType: file?.type,
        knownLength: file?.fileSize,
    });
}
export default formData