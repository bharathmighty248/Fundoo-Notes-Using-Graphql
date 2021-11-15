const express = require('express')
const { ApolloServer } = require('apollo-server-express')

require('dotenv').config()

const typeDefs = require('./app/typeDefs/user.schema');
const resolvers = require('./app/resolvers/user.resolver');
const dbconfig = require('./config/db.config')

dbconfig.dbConnection();

async function startServer(){
    const app = express()
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await apolloServer.start()

    apolloServer.applyMiddleware({ app });

    app.use((req,res) => {
        res.send("hello from express apollo server");
    });


    app.listen(process.env.PORT, () => console.log('server is running on port 4000'))
}
startServer();