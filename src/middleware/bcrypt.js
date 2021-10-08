
const bcrypt = require("bcryptjs");

exports.hashString = async (_password) => {
    //Mã hóa mật khẩu với số vòng lặp n
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(_password, salt);
    //console.log(hashPass.toString());

    return hashPass.toString();
}

exports.compareString = async (_password, _hashPassword) => {
    const comparePass = await bcrypt.compare(_password, _hashPassword);
    return comparePass
}