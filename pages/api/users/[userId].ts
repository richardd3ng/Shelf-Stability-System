import { db } from "@/lib/api/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getApiError } from "@/lib/api/error";
import { User } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getToken } from "next-auth/jwt";
import { checkIfUserIsAdmin } from "@/lib/api/auth/checkIfAdminOrExperimentOwner";
import { hashPassword } from "@/lib/api/auth/authHelpers";

const selectExceptPassword = {
    id: true,
    username: true,
    displayName: true,
    email: true,
    isSSO: true,
    isAdmin: true,
    isSuperAdmin: true
};

/**
   * @swagger
   * definitions:
   *   UserNoPassword:
   *     required:
   *       - id
   *       - username
   *       - displayName
   *       - isSSO
   *       - isAdmin
   *       - isSuperAdmin
   *     properties:
   *       id:
   *         type: number
   *       username:
   *         type: string
   *       displayName:
   *         type: string
   *       email:
   *         type: string
   *       isSSO:
   *         type: boolean
   *       isAdmin:
   *         type: boolean
   *       isSuperAdmin:
   *         type: boolean
   */

export default async function accessUserAPI(
    req: NextApiRequest,
    res: NextApiResponse<Omit<User, 'password'> | ApiError>
) {
    try {
        var userId: number;
        try {
            userId = Number(req.query.userId);

            if (isNaN(userId)) {
                res.status(400).json(
                    getApiError(400, "Invalid user ID")
                );
                return;
            }
        } catch (error) {
            res.status(400).json(
                getApiError(400, "Invalid user ID")
            );
            return;
        }

        if (req.method === "GET") {
            await getUser(userId, req, res);
        } else if (req.method === "PATCH") {
            await updateUser(userId, req, res);
        } else if (req.method === "DELETE") {
            await deleteUser(userId, req, res);
        } else {
            res.status(405).json(
                getApiError(405, "Method not allowed")
            );
        }
    } catch (error) {
        console.error(error);
        res.status(500).json(
            getApiError(500, "Internal server error")
        );
    }
}

/**
 *  @swagger
 *  /api/users/{userId}:
 *    get:
 *      summary: Gets a specific user
 *      tags: [Users]
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: userId
 *          in: path
 *          required: true
 *          type: number
 *      responses:
 *        200:
 *          description: The user with that ID
 *          schema:
 *            type: object
 *            $ref: '#/definitions/UserNoPassword'
 *        404:
 *          description: User not found
 * 
 */
async function getUser(userId: number, _req: NextApiRequest, res: NextApiResponse<Omit<User, 'password'> | ApiError>): Promise<void> {
    const user = await db.user.findUnique({
        where: {
            id: userId,
        },
        select: selectExceptPassword,
    });

    if (user === null) {
        res.status(404).json(
            getApiError(404, `User with ID ${userId} not found`)
        );
    } else {
        res.status(200).json(user);
    }
}

/**
 *  @swagger
 *  /api/users/{userId}:
 *    patch:
 *      summary: Updates the user
 *      tags: [Users]
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: userId
 *          in: path
 *          required: true
 *          type: number
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  displayName:
 *                    type: string
 *                  email:
 *                    type: string
 *                  password:
 *                    type: string
 *                  isAdmin:
 *                    type: boolean
 *      responses:
 *        200:
 *          description: Updated
 *          schema:
 *            type: object
 *            $ref: '#/definitions/UserNoPassword'
 *        401:
 *          description: Not authorized as admin
 *        403:
 *          description: Operation not permitted
 *        404:
 *          description: User not found
 * 
 */
async function updateUser(userId: number, req: NextApiRequest, res: NextApiResponse<Omit<User, 'password'> | ApiError>): Promise<void> {
    const token = await getToken({ req });

    if (token === null || !token.name || !(await checkIfUserIsAdmin(token.name))) {
        res.status(401).json(getApiError(401, "You are not authorized to update a user"));
        return;
    }

    const userToUpdate = await db.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            username: true,
            isSSO: true,
            isSuperAdmin: true,
        },
    });

    const { displayName, email, password, isAdmin } = req.body;

    if (userToUpdate === null) {
        res.status(404).json(
            getApiError(404, `User with ID ${userId} not found`)
        );
        return;
    }
    if (userToUpdate.isSSO) {
        var field = undefined;
        if (password !== "" && password !== undefined) {
            field = "password";
        } else if (displayName !== undefined) {
            field = "display name";
        } else if (email !== undefined) {
            field = "email";
        }

        if (field !== undefined) {
            res.status(403).json(
                getApiError(403, `Cannot set ${field} for SSO user`)
            );
            return;
        }
    }
    // Can't remove superadmin or own admin status
    if (isAdmin === false && (userToUpdate.isSuperAdmin || userToUpdate.username === token.name)) {
        res.status(403).json(
            getApiError(403, "Not permitted to remove admin status")
        );
        return;
    }

    const updatedUser = await db.user.update({
        where: {
            id: userId,
        },
        select: selectExceptPassword,
        data: {
            displayName,
            email,
            password: (password === "" || password === undefined) ? undefined : await hashPassword(password),
            isAdmin,
        },
    });

    res.status(200).json(updatedUser);
}

/**
 *  @swagger
 *  /api/users/{userId}:
 *    delete:
 *      summary: Deletes a user and reassigns their experiments to the super admin
 *      tags: [Users]
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: userId
 *          in: path
 *          required: true
 *          type: number
 *      responses:
 *        200:
 *          description: Returns the deleted user
 *          schema:
 *            type: object
 *            $ref: '#/definitions/UserNoPassword'
 *        400:
 *          description: The user does not exist
 *        401:
 *          description: Not authorized as admin
 *        404:
 *          description: User not found
 * 
 */
async function deleteUser(userId: number, req: NextApiRequest, res: NextApiResponse<Omit<User, 'password'> | ApiError>): Promise<void> {
    const token = await getToken({ req });

    if (token === null || !token.name || !(await checkIfUserIsAdmin(token.name))) {
        res.status(401).json(getApiError(401, "You are not authorized to delete a user"));
        return;
    }

    // Get the super admin's id
    // Maybe should be in a library function
    const admin = await db.user.findFirst({
        where: {
            isSuperAdmin: true
        },
        select: {
            id: true
        }
    });

    // Somehow we don't have a super admin, but we're logged in anyway
    if (admin === null) {
        res.status(500).json(
            getApiError(500)
        );
        console.error("No super admin found, this should never happen");
        return;
    }
    try {
        const [_, __, deletedUser] = await db.$transaction([
            db.experiment.updateMany({
                where: {
                    ownerId: userId,
                },
                data: {
                    ownerId: admin?.id,
                },
            }),
            db.assayTypeForExperiment.updateMany({
                where: {
                    technicianId: userId,
                },
                data: {
                    technicianId: null,
                },
            }),
            db.user.delete({
                where: {
                    id: userId,
                },
                select: selectExceptPassword,
            }),
        ]);

        res.status(200).json(deletedUser);
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError
            && error.code === "P2025") {
            res.status(400).json(
                getApiError(
                    400,
                    "The user does not exist"
                )
            );
            return;
        }
        // Rethrow for unexpected errors
        throw error;
    }
}
