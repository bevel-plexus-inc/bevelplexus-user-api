export function isInstanceOfError(data: any): boolean {
    if (!data || typeof data === "string" || typeof data !== "object") {
        return false;
    }

    return "error" in data;
}

export function isInstanceOfSuccess(data: any): boolean {
    if (!data || typeof data === "string" || typeof data !== "object") {
        return false;
    }

    return !("error" in data);
}
