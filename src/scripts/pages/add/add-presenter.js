// src/scripts/pages/add/add-presenter.js
import L from "leaflet";
import StoryApi from "../../data/story-api";

let stream;

const AddPresenter = {
  async startCamera(videoElement) {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoElement.srcObject = stream;
    } catch (err) {
      throw new Error("Gagal mengakses kamera: " + err.message);
    }
  },

  stopCamera() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
  },

  takePhoto(video, canvas) {
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  },

  initMap(mapElement, onMapClick) {
    const map = L.map(mapElement).setView([-6.2, 106.8], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    let marker = null;
    map.on("click", (e) => {
      const lat = e.latlng.lat;
      const lon = e.latlng.lng;

      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng).addTo(map);
      }

      marker
        .bindPopup(
          `<strong>Lokasi dipilih</strong><br>Lat: ${lat}<br>Lon: ${lon}`
        )
        .openPopup();
      onMapClick(lat, lon);
    });
  },

  async submitStory({ description, photo, lat, lon }) {
    try {
      const response = await StoryApi.postStory({
        description,
        photo,
        lat,
        lon,
      });
      console.log("submitStory response:", response);

      // Panggil notify hanya jika ada reportId
      const reportId = response?.data?.id || null;

      if (reportId) {
        this.notifyToAllUser(reportId);
      } else {
        console.warn("submitStory: reportId tidak ditemukan, tidak memicu notifikasi.");
      }

      return response;
    } catch (error) {
      console.error("submitStory: error:", error);
      throw error;
    }
  },

  async notifyToAllUser(reportId) {
    if (!reportId) {
      console.warn("notifyToAllUser: reportId tidak tersedia, batalkan notifikasi");
      return false;
    }

    try {
      const response = await StoryApi.sendReportToAllUserViaNotification(reportId);

      if (!response.ok) {
        console.error("#notifyToAllUser: response:", response);
        return false;
      }
      console.log("#notifyToAllUser: success", response.message);
      return true;
    } catch (error) {
      console.error("#notifyToAllUser: error:", error);
      return false;
    }
  },
};

export default AddPresenter;
