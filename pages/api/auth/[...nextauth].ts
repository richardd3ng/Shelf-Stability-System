import NextAuth, {Session} from "next-auth";
import type { NextApiRequest, NextApiResponse } from 'next';
import CredentialsProvider from "next-auth/providers/credentials";

import Token from "next-auth";
import { JWT } from "next-auth/jwt";
import { AdapterUser } from "next-auth/adapters";
import { User } from "next-auth";
import { USER_ID } from "./USERID";

export const authOptions = {
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                console.log("trying to authorize");
                const password = credentials ? credentials.password : "asdfasdf";
                console.log("the password is " + password);
                if (password === "password"){
                    return {id : USER_ID, name : USER_ID, email : USER_ID}
                } else {
                    return null;
                }
            }
        })
    ],
    
    secret: process.env.NEXTAUTH_SECRET,

    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        maxAge: 60 * 60 * 24 * 30,
        encryption: false,
    },

    pages: {
        signIn: "/login",
    },

    callbacks: {
        async jwt({ token, user} : {token : any, user : any}) {
            if (user) {
              token.id = user.id;
              token.name = user.id;
              token.email = user.name;
            }
            return token;
          },

        async session({session, token, user} : {session : any, token : any, user : any}) {
          session.user = token;
          return session;
        },

        
      },


};


export default NextAuth(authOptions);