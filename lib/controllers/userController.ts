import { ApiError } from "next/dist/server/api-utils";
import { ServerPaginationArgs } from "../hooks/useServerPagination";
import { UserTable } from "./types";
import { encodePaging, relativeURL } from "./url";
import { User } from "@prisma/client";

export const fetchUserList = async (query: string, paging: ServerPaginationArgs): Promise<UserTable> => {
    const url = encodePaging(relativeURL("/api/users/list"), paging);

    url.searchParams.append("query", query);

    const apiResponse = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const resJson = await apiResponse.json();
    if (apiResponse.ok) {
        return resJson;
    }

    throw new ApiError(apiResponse.status, resJson.message);
}

export const fetchUser = async (id: number): Promise<Omit<User, 'password'> | ApiError> => {
    const response = await fetch(`/api/users/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    const resJson = await response.json();
    if (response.ok) {
        return resJson;
    } else {
        return new ApiError(response.status, resJson.message);
    }
};

export const createUser = async (username: string, password: string, isAdmin: boolean): Promise<Omit<User, 'password'> | ApiError> => {
    const response = await fetch("/api/users/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
            isAdmin,
        }),
    });

    const resJson = await response.json();
    if (response.ok) {
        return resJson;
    } else {
        return new ApiError(response.status, resJson.message);
    }
};

export const updateUser = async (id: number, password: string, isAdmin: boolean): Promise<Omit<User, 'password'> | ApiError> => {
    const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            password,
            isAdmin,
        }),
    });

    const resJson = await response.json();
    if (response.ok) {
        return resJson;
    } else {
        return new ApiError(response.status, resJson.message);
    }
};

export const deleteUser = async (id: number): Promise<ApiError | null> => {
    const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        return null;
    } else {
        const resJson = await response.json();
        return new ApiError(response.status, resJson.message);
    }
};