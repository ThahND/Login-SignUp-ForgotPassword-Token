
const jwt = require("jsonwebtoken");


/*
 * private function generateToken
 * @param user
 * @param secretSignature
 * @param tokenLife
 */
let encodeToken = (user, secretKey, tokenLife) => {
    return new Promise((resolve, reject) => {
        // Định nghĩa những thông tin của user mà bạn muốn lưu vào token ở đây
        // const userData = {
        //     _id: user._id,
        //     name: user.name,
        //     email: user.email,
        // }

        // Thực hiện ký và tạo token
        jwt.sign(
            { data: user },
            secretKey,
            {
                algorithm: "HS256",
                expiresIn: tokenLife,
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    return reject(err);
                }
                return resolve(token);
            });
    });
}
/*
 * This module used for verify jwt token
 * @param {*} token
 * @param {*} secretKey
 */
let decodeToken = (token, secretKey) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (error, decoded) => {
            if (error) {
                return reject(error);
            }
            return resolve(decoded);
        });
    });
}


module.exports = { encodeToken, decodeToken };