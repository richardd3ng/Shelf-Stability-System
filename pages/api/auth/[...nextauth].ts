import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { USER_ID } from "@/lib/api/auth/authHelpers";
import { db } from "@/lib/api/db";
import { compare } from "bcryptjs";

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
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                try {
                    const password = credentials?.password;
                    if (password) {
                        const ROOT_USER = await db.user.findUnique({
                            where: {
                                username: USER_ID,
                            },
                        });
                        if (ROOT_USER) {
                            const correctPassword = await compare(
                                password,
                                ROOT_USER.password
                            );
                            if (correctPassword) {
                                return {
                                    id: ROOT_USER.username,
                                    name: ROOT_USER.username,
                                    email: ROOT_USER.username,
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
        async jwt({ token, user }: { token: any; user: any }) {
            if (user) {
                token.id = user.id;
                token.name = user.id;
                token.email = user.name;
            }
            return token;
        },

        async session({
            session,
            token,
            user,
        }: {
            session: any;
            token: any;
            user: any;
        }) {
            session.user = token;
            return session;
        },
    },
};

export default NextAuth(authOptions);
