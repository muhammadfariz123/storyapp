import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import HomePresenter from "./home-presenter";
import "../../../styles/pages/home-page.css";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

const HomePage = {
  async render() {
    return `
      <section class="container">
        <h1 class="title">📍 Daftar Cerita</h1>
        <div id="story-list" class="story-grid"></div>
        <div id="map" class="story-map"></div>
      </section>
    `;
  },

  async afterRender() {
    const listContainer = document.getElementById("story-list");
    const mapContainer = document.getElementById("map");

    const stories = await HomePresenter.getStories();

    listContainer.innerHTML = "";
    mapContainer.innerHTML = "";

    if (!stories || stories.length === 0) {
      listContainer.innerHTML = `<p>Belum ada cerita yang bisa ditampilkan.</p>`;
      return;
    }

    const map = L.map("map").setView([-6.2, 106.8], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    let html = "";

    stories.forEach((story) => {
      html += `
      <article class="story-card">
        <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" />
        <div class="story-content">
          <h2>${story.name}</h2>
          <p>${story.description}</p>
          <small>${new Date(story.createdAt).toLocaleString()}</small>
          <button class="btn detail-btn" data-id="${story.id}">Selengkapnya</button>
          <button class="delete-btn" data-id="${story.id}">🗑️ Hapus</button>
        </div>
      </article>
    `;

      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(
          `<strong>${story.name}</strong><br>${story.description}`
        );
      }
    });

    listContainer.innerHTML = html;

    listContainer.addEventListener("click", async (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const id = e.target.dataset.id;
        await HomePresenter.deleteStory(id);
        e.target.closest(".story-card").remove();
      } else if (e.target.classList.contains("detail-btn")) {
        const id = e.target.dataset.id;
        location.hash = `/detail/${id}`; // Kirim ID langsung, tanpa modifikasi
      }
    });
  },
};

export default HomePage;
