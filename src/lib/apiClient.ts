class ApiClient {
  constructor(private base = "/api") {}

  async request(path: string, options: RequestInit = {}) {
    try {
      const res = await fetch(this.base + path, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
        ...options,
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || json.message || "API Error");
      }

      return json;
    } catch (err: any) {
      console.error("API ERROR:", path, err.message);
      return { success: false, error: err.message };
    }
  }

  get(path: string) {
    return this.request(path, { method: "GET" });
  }

  post(path: string, body: any) {
    return this.request(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put(path: string, body: any) {
    return this.request(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  delete(path: string) {
    return this.request(path, { method: "DELETE" });
  }
}

export const api = new ApiClient();
