import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { connectDB } from "./db/connectDB.js";

import { mergedResolvers } from "./resolvers/index.js";
import { mergedTypeDefs } from "./typeDefs/index.js";

dotenv.config();

const app = express();

const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  '/',
  express.json(),
  cors(),
  expressMiddleware(server, {
    context: async({ req }) => ({ req }),
  }),
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

await connectDB();

console.log(`🚀 Server ready at http://localhost:4000/graphql`);
