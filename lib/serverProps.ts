import { GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";
import { checkIfUserIsAdmin } from "./api/auth/checkIfAdminOrExperimentOwner";

export async function requiresAdminProps(context: GetServerSidePropsContext, badResult: any = undefined, badStatus: number = 403) {
    const token = await getToken({ req: context.req });

    if (token === null || !token.name || !(await checkIfUserIsAdmin(token.name))) {
        context.res.statusCode = badStatus;
        
        return badResult ?? {
            redirect: {
                destination: '/experiment-list',
                permanent: false,
            },
        }
    }

    return { props: {} }
}