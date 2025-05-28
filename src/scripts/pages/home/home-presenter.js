import Api from '../../utils/api';

const HomePresenter = {
  async getStories() {
    try {
      const data = await Api.getStories();
      if (data.error) throw new Error(data.message);

      const stories = data.listStory;

      // HAPUS PENYIMPANAN OTOMATIS KE INDEXEDDB
      // supaya IndexedDB hanya menyimpan yang disimpan user saja

      return stories;
    } catch (error) {
      // Jika offline, ambil dari IndexedDB saja
      console.warn('Offline or API failed. Showing saved data:', error.message);
      // Tetap gunakan db.getAllStories untuk fallback
      const db = await import('../../utils/db');
      return await db.default.getAllStories();
    }
  },

  async deleteStory(id) {
    const db = await import('../../utils/db');
    await db.default.deleteStory(id);
  },
};

export default HomePresenter;
