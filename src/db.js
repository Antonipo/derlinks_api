import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    host: process.env.HOST_DB,
    port: process.env.PORT_DB,
    database: process.env.NAME_DB,
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
});


async function connectToBD(){
    try {
        const client = await pool.connect()
        console.log('PostgreSQL connected')
        return client;
    } catch (error) {
        console.log("Hubo un error")
        console.error(error)
    }
};

export {
    connectToBD,
};



