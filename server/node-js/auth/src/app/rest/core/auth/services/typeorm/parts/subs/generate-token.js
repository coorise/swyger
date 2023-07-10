import {jwt} from "../../../../../../../services";
const generateToken = (user) => {
    return jwt.sign(user);
};
export default generateToken
