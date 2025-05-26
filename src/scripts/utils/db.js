import { openDB } from 'idb';

const DB_NAME = 'story-db';
const DB_VERSION = 1;
const STORE_STORIES = 'stories';
const STORE_COMMENTS = 'comments';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_STORIES)) {
      db.createObjectStore(STORE_STORIES, { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains(STORE_COMMENTS)) {
      const commentStore = db.createObjectStore(STORE_COMMENTS, { keyPath: 'id', autoIncrement: true });
      commentStore.createIndex('storyId', 'storyId');
    }
  },
});

const db = {
  async addStory(story) {
    if (!story.id) throw new Error('Story must have an id to be stored.');
    const db = await dbPromise;
    await db.put(STORE_STORIES, story);
  },

  async getStory(id) {
    const db = await dbPromise;
    return await db.get(STORE_STORIES, id);
  },

  async getAllStories() {
    const db = await dbPromise;
    return await db.getAll(STORE_STORIES);
  },

  async deleteStory(id) {
    const db = await dbPromise;
    return await db.delete(STORE_STORIES, id);
  },

  async addComment(comment) {
    const db = await dbPromise;
    await db.add(STORE_COMMENTS, comment);
  },

  async getCommentsByStoryId(storyId) {
    const db = await dbPromise;
    return await db.getAllFromIndex(STORE_COMMENTS, 'storyId', storyId);
  }
};

export default db;
