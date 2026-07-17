const BASE_URL = 'http://127.0.0.1:5000/api';

interface RequestOptions extends RequestInit {
  body?: any;
}

export const apiRequest = async (endpoint: string, options: RequestOptions = {}) => {
  const token = localStorage.getItem('token');
  const hasBody = options.body !== undefined && options.body !== null;
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(hasBody && !isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...((options.headers as object) || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (hasBody && !isFormData) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`İstek başarısız (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data;
};