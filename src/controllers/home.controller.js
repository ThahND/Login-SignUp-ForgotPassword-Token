const service = require('../services/users.service');


exports.getHome = async (req, res) => {
    return res.redirect('http://localhost:3003/list/users');
    // return res.render('Shared/_Layout', { linkPage: 'home/index', data: null });
}