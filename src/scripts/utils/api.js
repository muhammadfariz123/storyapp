import { getAccessToken } from "./auth"; // pastikan path ini benar sesuai struktur proyek

const BASE_URL = "https://story-api.dicoding.dev/v1";

const ENDPOINTS = {
  SUBSCRIBE: `${BASE_URL}/notification/subscribe`,
  UNSUBSCRIBE: `${BASE_URL}/notification/unsubscribe`,
};

const Api = {
  async getLogin({ email, password }) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    return {
      ok: response.ok,
      message: result.message,
      data: {
        accessToken: result.loginResult?.token || null,
      },
    };
  },

  async register({ name, email, password }) {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    return response.json();
  },

  async getStories() {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/stories`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.json();
  },

  async getStoryById(id) {
    const token = localStorage.getItem("token");

    // Gunakan id apa adanya tanpa diubah
    const response = await fetch(`${BASE_URL}/stories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    return {
      ...data,
      ok: response.ok,
    };
  },

  // Method subscribe push notification
  async subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
    const accessToken = getAccessToken();
    const data = JSON.stringify({ endpoint, keys: { p256dh, auth } });

    const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: data,
    });

    const json = await fetchResponse.json();

    return {
      ...json,
      ok: fetchResponse.ok,
    };
  },

  // Method unsubscribe push notification
  async unsubscribePushNotification({ endpoint }) {
    const accessToken = getAccessToken();
    const data = JSON.stringify({ endpoint });

    const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: data,
    });

    const json = await fetchResponse.json();

    return {
      ...json,
      ok: fetchResponse.ok,
    };
  },

  async sendReportToMeViaNotification(reportId) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}/reports/${reportId}/notify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return {
      ...data,
      ok: response.ok,
    };
  },
};

export default Api;
