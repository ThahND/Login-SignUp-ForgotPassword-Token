
module.exports = {
    'connectString': "postgres://postgres:1234@localhost:5432/demo",

    'connectObj': {
        database: 'demo',
        username: 'postgres',
        password: '******',
        host: 'localhost',
        post: 5432,
        dialect: 'postgres',
        define: {
            freezeTableName: true
        }
    }
}
