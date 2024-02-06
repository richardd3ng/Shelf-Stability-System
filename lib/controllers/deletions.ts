export const deleteEntity = async (apiUrl : string) => {
    const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (response.status > 300) {
        let resJson = await response.json();
        throw new Error(resJson.error);
    }
}
