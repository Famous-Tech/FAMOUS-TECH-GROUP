require('dotenv').config();

const validUsers = {
    [process.env.ADMIN_USERNAME_1]: process.env.ADMIN_PASSWORD_1,
    [process.env.ADMIN_USERNAME_2]: process.env.ADMIN_PASSWORD_2
};

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed'
        };
    }

    const { username, password } = JSON.parse(event.body);

    if (validUsers[username] === password) {
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } else {
        return {
            statusCode: 401,
            body: JSON.stringify({ success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect' })
        };
    }
};