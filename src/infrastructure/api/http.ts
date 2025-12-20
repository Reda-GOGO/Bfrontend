const BASE_URL = import.meta.env.VITE_API_URL || "";

class HttpClient {
  async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(BASE_URL + url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "API Error");
    }

    return response.json();
  }

  get<T>(url: string, params?: Record<string, any>) {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.request<T>(url + qs);
  }

  post<T>(url: string, body?: any) {
    return this.request<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  put<T>(url: string, body?: any) {
    return this.request<T>(url, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  delete<T>(url: string) {
    return this.request<T>(url, { method: "DELETE" });
  }
}

export const http = new HttpClient();
