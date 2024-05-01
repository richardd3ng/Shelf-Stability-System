import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/api/db";
import { compare } from "bcryptjs";
import DukeProvider from "@/lib/api/auth/dukeProvider";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "Username", type: "username" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                // TODO block SSO accounts
                try {
                    const username = credentials?.username;
                    const password = credentials?.password;
                    if (username && password) {
                        const user = await db.user.findUnique({
                            where: {
                                username: username,
                            },
                        });
                        if (user && user.password) {
                            const correctPassword = await compare(
                                password,
                                user.password
                            );
                            if (correctPassword) {
                                return {
                                    id: user.id.toString(),
                                    name: user.username,
                                    email: user.username,
                                };
                            } else {
                                return null;
                            }
                        } else {
                            return null;
                        }
                    } else {
                        return null;
                    }
                } catch {
                    return null;
                }
            },
        }),
        DukeProvider(
            process.env.DUKE_CLIENT_ID,
            process.env.DUKE_CLIENT_SECRET
        ),
    ],

    secret: process.env.NEXTAUTH_PUBLIC_SECRET,

    jwt: {
        secret: process.env.NEXTAUTH_PUBLIC_SECRET,
        maxAge: 60 * 60 * 24 * 30,
    },

    pages: {
        signIn: "/auth/login",
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token;
            return session;
        },
    },
};

export default NextAuth(authOptions);
