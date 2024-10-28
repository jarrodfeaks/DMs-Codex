/**
 * Options for customizing API request behavior.
 * @interface RequestOptions
 * @property {boolean} [throwOnError=true] If true, throws an error for non-2xx responses.
 * @property {boolean} [returnRawResponse=false] If true, returns the raw Response object instead of parsing JSON.
 */
interface RequestOptions {
  throwOnError?: boolean;
  returnRawResponse?: boolean;
}

const handleResponse = async (response: Response, options: RequestOptions = {}) => {
    const { throwOnError = true, returnRawResponse = false } = options;
    
    if (!response.ok && throwOnError) {
        throw new Error(`${response.status} ${response.body ? await response.text() : response.statusText}`);
    }
    
    return returnRawResponse ? response : response.status === 204 ? null : response.json();
};

// Adds correct prefix to endpoint if not already present
const ensureApiPrefix = (endpoint: string): string => {
    return endpoint.startsWith('/api') ? endpoint : `/api${endpoint}`;
};

export const apiService = {
    get: async (endpoint: string, options: RequestOptions = {}) => {
        const res = await fetch(ensureApiPrefix(endpoint));
        return handleResponse(res, options);
    },
    post: async (endpoint: string, data: Record<string, unknown> | FormData, options: RequestOptions = {}) => {
        const isFormData = data instanceof FormData;
        const res = await fetch(ensureApiPrefix(endpoint), {
            method: "POST",
            headers: !isFormData ? { "Content-Type": "application/json" } : undefined,
            body: !isFormData ? JSON.stringify(data) : data,
        });
        return handleResponse(res, options);
    },
    put: async (endpoint: string, data: Record<string, unknown>, options: RequestOptions = {}) => {
        const res = await fetch(ensureApiPrefix(endpoint), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        return handleResponse(res, options);
    },
    delete: async (endpoint: string, options: RequestOptions = {}) => {
        const res = await fetch(ensureApiPrefix(endpoint), { method: "DELETE" });
        return handleResponse(res, options);
    }
}
