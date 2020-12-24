import { ApolloServer } from "apollo-server-express";
import Express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { connect } from "mongoose";


import { UserResolver } from "./resolvers/User";
import { ProductResolver } from "./resolvers/Product";
import { CategoryResolver } from "./resolvers/Category";
import { CartResolver } from "./resolvers/Cart";
import { OrderResolver } from "./resolvers/Order";
import { RecipeResolver } from "./resolvers/Recipe";
import { RateResolver } from "./resolvers/Rate";
import { User } from "./entities/User";

export interface Context {
  user: User;
}


const main = async () => {

  const schema = await buildSchema({
    resolvers: [CategoryResolver, ProductResolver, UserResolver, CartResolver, OrderResolver, RecipeResolver, RateResolver],
    emitSchemaFile: true,
    validate: false,
  });


  // create mongoose connection
  const mongoose = await connect('mongodb://localhost:27017/test', { useNewUrlParser: true });
  await mongoose.connection;



  const server = new ApolloServer({ 
    schema,
    context: ({ req }) => {
      // Get the user token from the headers.
      const token = req.headers.authorization || '';
      console.log('token', token);
   
      // add the user to the context
      return { 
        user: {
          name: 'fake user',
        },};
    },
   
   });

  const app = Express();

  server.applyMiddleware({ app });

  app.listen({ port: 3333 }, () =>
    console.log(`🚀 Server ready and listening at ==> http://localhost:3333${server.graphqlPath}`))

};

main().catch((error) => {
  console.log(error, 'error');
})