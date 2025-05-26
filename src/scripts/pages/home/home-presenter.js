import Api from '../../utils/api';
import db from '../../utils/db';

const HomePresenter = {
  async getStories() {
    try {
      const data = await Api.getStories();
      if (data.error) throw new Error(data.message);

      const stories = data.listStory;

      // Simpan ke IndexedDB
      for (const story of stories) {
        await db.addStory(story); // <- ganti dari db.put() ke db.addStory()
      }

      return stories;
    } catch (error) {
      // Jika gagal ambil dari IndexedDB
      console.warn('Offline or API failed. Showing saved data:', error.message);
      const stories = await db.getAllStories(); // <- ganti dari db.getAll()
      return stories;
    }
  },

  async deleteStory(id) {
    await db.deleteStory(id); // <- ganti dari db.delete()
  },
};

export default HomePresenter;
