import { ApolloServer } from "apollo-server-express";
import { schema } from "./schema";
import { Application } from "express";
import { auth } from "express-oauth2-jwt-bearer";

const checkJwt = auth({
    audience: 'https://dev-4sw1x68wd1xamebs.us.auth0.com/api/v2/',
    issuerBaseURL: `https://dev-4sw1x68wd1xamebs.us.auth0.com/`,
});

export async function initMiddleWare(app: Application) {
    // Apply JWT middleware to protect the /api/graphql route
    app.use('/api/graphql', checkJwt);

    // Set up Apollo Server
    const server = new ApolloServer({
        schema,
        context: ({ req }) => {
            // console.log(req.auth);
            const user = req.auth ? req.auth : null;
            return { user, req };
        }
    });

    // Start Apollo Server and apply middleware
    await server.start();
    server.applyMiddleware({ app, path: '/api/graphql' });

    console.log('GraphQL is exposing on path /api/graphql');
}
