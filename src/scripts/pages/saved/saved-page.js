import db from '../../utils/db';

const SavedPage = {
  async render() {
    return `
      <section class="saved-page">
        <h2>Cerita Tersimpan</h2>
        <div id="stories-list" class="stories-list">
          <p>Memuat cerita...</p>
        </div>
      </section>
    `;
  },

  async afterRender() {
    const container = document.getElementById('stories-list');
    try {
      // Ambil cerita dari IndexedDB bukan API
      const stories = await db.getAllStories();

      if (!stories || stories.length === 0) {
        container.innerHTML = '<p>Belum ada cerita tersimpan.</p>';
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

      // Pasang event listener untuk tombol hapus
      container.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-saved-btn')) {
          const id = e.target.dataset.id;
          if (confirm('Yakin ingin menghapus cerita ini dari simpanan?')) {
            try {
              await db.deleteStory(id);
              // Hapus elemen cerita dari DOM
              const storyElement = e.target.closest('.story-item');
              if (storyElement) storyElement.remove();

              // Jika sudah tidak ada cerita tersimpan, tampilkan pesan
              if (container.children.length === 0) {
                container.innerHTML = '<p>Belum ada cerita tersimpan.</p>';
              }
            } catch (error) {
              alert('Gagal menghapus cerita: ' + error.message);
            }
          }
        }
      });
    } catch (error) {
      container.innerHTML = `<p>Terjadi kesalahan: ${error.message}</p>`;
    }
  }
};

export default SavedPage;
