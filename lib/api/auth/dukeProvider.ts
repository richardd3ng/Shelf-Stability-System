import { OAuthConfig } from "next-auth/providers/oauth"

export interface DukeProfile {
    
}

// Redirect will be http://localhost:3000/api/auth/callback/duke for local
export default function DukeProvider(): OAuthConfig<DukeProfile> {
    return {
        id: "duke",
        name: "Duke",
        type: "oauth",
        wellKnown: "https://oauth.oit.duke.edu/oidc/.well-known/openid-configuration",
        authorization: { params: { scope: "openid email profile" } },
        idToken: true, // TODO
        checks: ["pkce", "state"], // TODO
        clientId: process.env.DUKE_CLIENT_ID,
        clientSecret: process.env.DUKE_CLIENT_SECRET,
        profile(profile) {
            // TODO get details we need from profile
            return {
                id: "",
                name: "",
                email: "",
                image: null
            }
        },
    }
}