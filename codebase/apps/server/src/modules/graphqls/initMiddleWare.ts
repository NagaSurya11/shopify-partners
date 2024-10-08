import { ApolloServer } from "apollo-server-express";
import { schema } from "./schema";
import { Application } from "express";
import jwksRsa from 'jwks-rsa';
import jwt from 'jsonwebtoken';

// Configure JWKS client to get public keys from Keycloak
const jwksClient = jwksRsa({
    jwksUri: 'http://localhost:8080/realms/dev/protocol/openid-connect/certs', // Replace with your Keycloak realm URL
    cache: true,
    rateLimit: true
});

export async function initMiddleWare(app: Application) {

    // Set up Apollo Server
    const server = new ApolloServer({
        schema,  // Your GraphQL schema
        context: async ({ req }) => {
            const authHeader = req.headers.authorization || '';
            const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
            let user = null;
            if (!token) {
                console.error('Unauthorized: No token provided');
                throw new Error('Unauthorized: No token provided');
            }

            try {
                // Decode the token header to get the key id (kid)
                const decodedHeader = jwt.decode(token, { complete: true });

                // Get the signing key from the Keycloak JWKS endpoint
                const key = await jwksClient.getSigningKey(decodedHeader.header.kid);
                const signingKey = key.getPublicKey();

                // Verify the token with the public key
                jwt.verify(token, signingKey, { algorithms: ['RS256'] }, (err, decoded) => {
                    if (err) {
                        console.error('Unauthorized: Invalid token');
                        throw new Error('Unauthorized: Invalid token');
                    }

                    // If token is valid, proceed
                    user = decoded;
                });
            } catch (err) {
                console.error('Error verifying token', err);
                throw new Error('Error verifying token');
            }

            return { user, req };  // Pass user info and request to context
        }
    });

    // Start Apollo Server and apply middleware
    await server.start();
    server.applyMiddleware({ app, path: '/api/graphql' });

    console.log('GraphQL is Exposing on Path /api/graphql');
}