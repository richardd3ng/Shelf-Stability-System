export default function DukeProvider() {
    return {
        id: "duke",
        name: "Duke",
        type: "oauth",
        wellKnown: "https://accounts.google.com/.well-known/openid-configuration", // TODO
        authorization: { params: { scope: "openid email profile" } }, // TODO
        idToken: true, // TODO
        checks: ["pkce", "state"], // TODO
        profile(profile) { // TODO
            return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.picture,
            }
        },
    }
}