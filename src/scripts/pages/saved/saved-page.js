import db from '../../utils/db';

const SavedPage = {
  async render() {
    return `
      <section class="saved-page">
        <h2>Cerita Tersimpan</h2>
        <div id="loading" style="display:none;">Memproses...</div>
        <div id="notification" style="display:none; padding: 10px; margin-bottom: 10px; border-radius: 4px;"></div>
        <div id="stories-list" class="stories-list">
          <p>Memuat cerita...</p>
        </div>
      </section>
    `;
  },

  async afterRender() {
    const container = document.getElementById('stories-list');
    const loading = document.getElementById('loading');
    const notification = document.getElementById('notification');

    const showLoading = () => loading.style.display = 'block';
    const hideLoading = () => loading.style.display = 'none';
    const showNotification = (message, isSuccess = true) => {
      notification.style.display = 'block';
      notification.style.backgroundColor = isSuccess ? '#d4edda' : '#f8d7da';
      notification.style.color = isSuccess ? '#155724' : '#721c24';
      notification.textContent = message;
      setTimeout(() => notification.style.display = 'none', 3000);
    };

    try {
      showLoading();

      const stories = await db.getAllStories();

      if (!stories || stories.length === 0) {
        container.innerHTML = '<p>Belum ada cerita tersimpan.</p>';
        hideLoading();
        return;
      }

      container.innerHTML = stories.map(story => `
        <article class="story-item" data-id="${story.id}">
          <h3>${story.name || 'Judul tidak tersedia'}</h3>
          <p>${story.description || 'Deskripsi tidak tersedia'}</p>
          <img src="${story.photoUrl || ''}" alt="Gambar cerita" style="max-width:100%;height:auto;" />
          <button class="btn delete-saved-btn" data-id="${story.id}">Hapus dari Simpanan</button>
        </article>
      `).join('');

      hideLoading();

      container.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-saved-btn')) {
          const id = e.target.dataset.id;
          if (confirm('Yakin ingin menghapus cerita ini dari simpanan?')) {
            try {
              showLoading();
              await db.deleteStory(id);
              const storyElement = e.target.closest('.story-item');
              if (storyElement) storyElement.remove();
              if (container.children.length === 0) {
                container.innerHTML = '<p>Belum ada cerita tersimpan.</p>';
              }
              showNotification('Cerita berhasil dihapus dari simpanan.', true);
            } catch (error) {
              showNotification('Gagal menghapus cerita: ' + error.message, false);
            } finally {
              hideLoading();
            }
          }
        }
      });
    } catch (error) {
      hideLoading();
      container.innerHTML = `<p>Terjadi kesalahan: ${error.message}</p>`;
    }
  }
};

export default SavedPage;
