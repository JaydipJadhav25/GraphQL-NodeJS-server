// import express from "express"
const express = require("express")
const {ApolloServer} = require("@apollo/server");
const { expressMiddleware} = require("@apollo/server/express4");
const bodyPareser = require("body-parser");
const core = require("cors");
const {default :axios} = require("axios")




async function startServer(){
    const app = express();
    const server = new ApolloServer({
        typeDefs :`
        type User {
           id : ID!
           name : String!
           username : String
           email : String
           phone :String
        }
        type Todo {
        id : ID!
        title : String!
        completed :Boolean
        }

        type Query {
          getTodos : [Todo] 
          getallUser : [User] 
        }
        `,
        resolvers:{
            Query : {
                // getTodos: () => [{id : 1 , title : "demo", completed : false}]
                getTodos:async () =>(await  axios.get("https://jsonplaceholder.typicode.com/todos")).data,
                // getTodos:async () => await  axios.get("https://jsonplaceholder.typicode.com/todos") error 
               
                getallUser : async () => (await axios.get("https://jsonplaceholder.typicode.com/users")).data
            }
        }
        
    });


//middleware
app.use(bodyPareser.json());
app.use(core());


//start graphQl server
await server.start();

//at end point graphql  to handler graphql server
app.use("/graphql" , expressMiddleware(server));




app.listen(3000 , ()=>console.log("server running on PORT :3000"))
}

startServer();