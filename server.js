const express = require('express')
const { ApolloServer } = require('apollo-server-express')

require('dotenv').config()

const typeDefs = require('./app/typeDefs/index');
const resolvers = require('./app/resolvers/index');
const dbconfig = require('./config/db.config');
const logger = require('./config/logger');

dbconfig.dbConnection();

async function startServer() {
    const app = express()
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await apolloServer.start()

    apolloServer.applyMiddleware({ app });

    app.use((req,res) => {
        res.send("hello from apollo server");
    });


    app.listen(process.env.PORT, () => logger.info('server is running on port 4000'))
}
startServer();
