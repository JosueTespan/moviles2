const BASE_URL = 'http://192.168.1.103:8080';

class ApiError extends Error {
    constructor(message, { status, data }) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

async function makeRequest(path, { method = 'GET', headers = {}, timeoutMs = 15000 } = {}, body = null) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

        const options = {
            method,
            headers: {
                Accept: 'application/json',
                ...(body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
                ...headers,
            },
            signal: controller.signal,
        };

        if (body) {
            options.body = isFormData ? body : JSON.stringify(body);
        }

        const res = await fetch(`${BASE_URL}${path}`, options)
        const ct = res.headers.get('content-type') || '';
        const isJson = ct.includes('application/json');
        const payload = isJson ? await res.json() : await res.text();

        if (!res.ok) throw new ApiError('HTTP Error', { status: res.status, data: payload });

        return payload;
    } finally {
        clearTimeout(id);
    }
}

export { makeRequest };