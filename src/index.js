import dotenv from 'dotenv/config.js'
import app from './app.js';
import { connectToBD } from './db.js';

if(process.env.NODE_ENV !== 'production'){
    dotenv
}


async function main() {
    await connectToBD();
    app.listen(app.get("port"), () => {
        console.log("server on port", app.get("port"));
    });
}

main()