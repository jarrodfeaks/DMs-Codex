const handleResponse = async (response: Response) => {
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }
    return response.json();
};

// Adds correct prefix to endpoint if not already present
const ensureApiPrefix = (endpoint: string): string => {
    return endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
};

export const apiService = {
    get: async (endpoint: string) => {
        const res = await fetch(ensureApiPrefix(endpoint));
        return handleResponse(res);
    },
    post: async (endpoint: string, data: Record<string, unknown> | FormData) => {
        const isFormData = data instanceof FormData;
        const res = await fetch(ensureApiPrefix(endpoint), {
            method: "POST",
            headers: !isFormData ? { "Content-Type": "application/json" } : undefined,
            body: !isFormData ? JSON.stringify(data) : data,
        });
        return handleResponse(res);
    },
    put: async (endpoint: string, data: Record<string, unknown>) => {
        const res = await fetch(ensureApiPrefix(endpoint), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },
    delete: async (endpoint: string) => {
        const res = await fetch(ensureApiPrefix(endpoint), { method: "DELETE" });
        return handleResponse(res);
    }
}
