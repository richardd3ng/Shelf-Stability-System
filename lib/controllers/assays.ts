import { AssayInfo } from "./types";

export const fetchAgendaList = async (minDate: Date | null, maxDate: Date | null) : Promise<AssayInfo[]> => {
    const url = new URL("/api/assays/agenda", typeof window !== "undefined" ? window.location.origin : undefined);
    if (minDate !== null) {
        url.searchParams.set("minDate", minDate.toISOString());
    }
    if (maxDate !== null) {
        url.searchParams.set("maxDate", maxDate.toISOString());
    }

    const apiResponse = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (apiResponse.ok) {
        return await apiResponse.json()
            .then((data: AssayInfo[]) =>
                // Convert the targetDate from string to Date
                data.map(assay => ({...assay, targetDate: new Date(assay.targetDate)})));
    }
    throw new Error(apiResponse.status +": Failed to fetch assays");
}
