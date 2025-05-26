import { getAccessToken } from "../utils/auth";

const BASE_URL = "https://story-api.dicoding.dev/v1";

const StoryApi = {
  async getStories() {
    const token = getAccessToken();

    const response = await fetch(`${BASE_URL}/stories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Gagal ambil data:", error.message);
      return [];
    }

    const result = await response.json();
    return result.listStory;
  },

  async postStory({ description, photo, lat, lon }) {
    const token = getAccessToken();
    const formData = new FormData();

    formData.append("description", description);
    formData.append("photo", photo);
    if (lat) formData.append("lat", lat);
    if (lon) formData.append("lon", lon);

    const response = await fetch(`${BASE_URL}/stories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return response.json();
  },

  // Method subscribe push notification
  async subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
    const accessToken = getAccessToken();
    const data = JSON.stringify({
      endpoint,
      keys: { p256dh, auth },
    });

    const fetchResponse = await fetch(`${BASE_URL}/notifications/subscribe`, {
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

    const fetchResponse = await fetch(`${BASE_URL}/notifications/subscribe`, {
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

  async sendReportToAllUserViaNotification(reportId) {
    const token = getAccessToken();

    const response = await fetch(`${BASE_URL}/reports/${reportId}/notify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await response.json();
    return {
      ...json,
      ok: response.ok,
    };
  },
};

export default StoryApi;
