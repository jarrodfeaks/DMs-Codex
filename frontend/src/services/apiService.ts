const handleResponse = async (response: Response, throwOnError: boolean = true) => {
    if (!response.ok && throwOnError) {
        throw new Error(`${response.status} ${response.body ? await response.text() : response.statusText}`);
    }
    return response.json();
};

// Adds correct prefix to endpoint if not already present
const ensureApiPrefix = (endpoint: string): string => {
    return endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
};

export const apiService = {
    get: async (endpoint: string, throwOnError: boolean = true) => {
        const res = await fetch(ensureApiPrefix(endpoint));
        return handleResponse(res, throwOnError);
    },
    post: async (endpoint: string, data: Record<string, unknown> | FormData, throwOnError: boolean = true) => {
        const isFormData = data instanceof FormData;
        const res = await fetch(ensureApiPrefix(endpoint), {
            method: "POST",
            headers: !isFormData ? { "Content-Type": "application/json" } : undefined,
            body: !isFormData ? JSON.stringify(data) : data,
        });
        return handleResponse(res, throwOnError);
    },
    put: async (endpoint: string, data: Record<string, unknown>, throwOnError: boolean = true) => {
        const res = await fetch(ensureApiPrefix(endpoint), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return handleResponse(res, throwOnError);
    },
    delete: async (endpoint: string, throwOnError: boolean = true) => {
        const res = await fetch(ensureApiPrefix(endpoint), { method: "DELETE" });
        return handleResponse(res, throwOnError);
    }
}
