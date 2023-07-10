const sendRequestedEmail=(request)=> {
    switch (request.type) {
        case 'user_signup': {
            console.log(`Should send an e-mail to ${request.user.email} to verify their e-mail address with code ${request.activationCode}`);
            break;
        }
        case 'user_reset_password': {
            console.log(`Should send an e-mail to ${request.user.email} to reset their password with code ${request.resetCode}`);
            break;
        }
    }
}
export default sendRequestedEmail