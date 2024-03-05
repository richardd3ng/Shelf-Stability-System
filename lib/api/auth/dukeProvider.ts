import { OAuthConfig } from "next-auth/providers/oauth"
import { createOrUpdateUser } from "../dbOperations/userOperations";

export interface DukeProfile {
    sub: string,
    dukeNetID: string,
    dukeUniqueID: string,
    dukePrimaryAffiliation: string,
    name: string,
    given_name: string,
    family_name: string,
    email: string,
    email_verified: boolean,
}

// Redirect will be http://localhost:3000/api/auth/callback/duke for local
export default function DukeProvider(clientId?: string, clientSecret?: string): OAuthConfig<DukeProfile> {
    return {
        id: "duke",
        name: "Duke",
        type: "oauth",
        wellKnown: "https://oauth.oit.duke.edu/oidc/.well-known/openid-configuration",
        authorization: { params: { scope: "openid email profile" } },
        clientId: clientId,
        clientSecret: clientSecret,
        // https://github.com/nextauthjs/next-auth/discussions/4164
        userinfo: {
            async request(context){
                if (!context?.tokens?.access_token) {
                    throw new Error("No access token available")
                }
                return await context.client.userinfo(context.tokens.access_token)
            }
        },
        async profile(profile) {
            await createOrUpdateUser(profile.dukeNetID, profile.name, profile.email, true);
            
            return {
                id: profile.dukeNetID,
                name: profile.name,
                email: profile.email,
                image: null
            }
        },
    }
}