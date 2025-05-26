// src/scripts/pages/add/add-page.js
import '../../../styles/pages/add-page.css';

const AddPage = {
  async render() {
    return `
      <section class="add-container">
        <h1 class="add-title">📸 Tambah Cerita</h1>
        <form id="story-form" class="add-form">
          <label for="name">Nama:</label>
          <input type="text" id="name" name="name" required />

          <label for="description">Deskripsi:</label>
          <textarea id="description" name="description" required></textarea>

          <label for="photo">Foto:</label>
          <div class="camera-wrapper">
            <video id="camera-stream" autoplay playsinline></video>
            <canvas id="canvas" style="display:none;"></canvas>
            <button type="button" id="take-photo" class="btn">Ambil Foto</button>
          </div>

          <label>Lokasi:</label>
          <div id="map" class="map-area"></div>

          <input type="hidden" id="lat" name="lat">
          <input type="hidden" id="lon" name="lon">

          <button type="submit" class="btn submit-btn">Kirim Cerita</button>
        </form>
      </section>
    `;
  },

  async afterRender() {
    const AddPresenter = (await import('./add-presenter')).default;

    const video = document.getElementById('camera-stream');
    const canvas = document.getElementById('canvas');
    const takePhotoBtn = document.getElementById('take-photo');
    const form = document.getElementById('story-form');
    const mapContainer = document.getElementById('map');
    const latInput = document.getElementById('lat');
    const lonInput = document.getElementById('lon');
    const descriptionInput = document.getElementById('description');

    let photoBlob = null;

    // Start Camera
    try {
      await AddPresenter.startCamera(video);
    } catch (err) {
      alert(err.message);
    }

    // Init Map
    AddPresenter.initMap(mapContainer, (lat, lon) => {
      latInput.value = lat;
      lonInput.value = lon;
    });

    // Ambil Foto
    takePhotoBtn.addEventListener('click', async () => {
      photoBlob = await AddPresenter.takePhoto(video, canvas);
      alert('Foto berhasil diambil!');
    });

    // Submit Cerita
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const description = descriptionInput.value;
      const lat = latInput.value;
      const lon = lonInput.value;

      if (!photoBlob) {
        alert('Ambil foto terlebih dahulu.');
        return;
      }

      const response = await AddPresenter.submitStory({
        description,
        photo: photoBlob,
        lat,
        lon
      });

      if (!response.error) {
        alert('Cerita berhasil dikirim!');
        AddPresenter.stopCamera();
        window.location.hash = '#/home';
      } else {
        alert('Gagal kirim cerita: ' + response.message);
      }
    });

    // Stop Camera on page leave
    window.addEventListener('hashchange', () => {
      AddPresenter.stopCamera();
    });
  }
};

export default AddPage;
