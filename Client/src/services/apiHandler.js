const baseUrl = 'http://localhost:5000/api';

function toQueryString(params) {
  return Object.keys(params)
    .map(key => key + '=' + encodeURIComponent(params[key]))
    .join('&');
}

class ApiHandler {
  static async request(endpoint, method = 'GET', body, query, customHeaders, requireToken = true) {
    const headers = {
      'Accept': 'application/json',
      ...customHeaders
    };

    // Don't set Content-Type for FormData, let the browser set it with the boundary
    if (!(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (requireToken) {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (query) {
      endpoint += `?${toQueryString(query)}`;
    }

    const config = {
      method: method,
      headers: headers,
      credentials: 'include',
    };

    if (body) {
      config.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    const response = await fetch(`${baseUrl}${endpoint}`, config);
    const data = await response.json();
    if (!response.ok) {
      if (data?.errors) {
        throw {
          message: data.message,
          errors: data.errors
        };  
      } else {
        throw new Error(data.message || 'Failed API request');
      }
    }
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  }
}

export default ApiHandler; 