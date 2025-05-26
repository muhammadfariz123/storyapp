// detail-page.js

import DetailPresenter from './detail-presenter';
import { parseActivePathname } from '../../routes/url-parser';

const DetailPage = {
  async render() {
    return `
      <section class="detail-container">
        <h2>Detail Cerita</h2>
        <div id="detail-content">Memuat data...</div>
        <div id="comments-section">
          <h3>Komentar</h3>
          <div id="comments-list">Memuat komentar...</div>
          <form id="comment-form">
            <textarea id="comment-input" placeholder="Tulis komentar Anda..." required></textarea>
            <button type="submit">Kirim Komentar</button>
          </form>
        </div>
        <button id="save-story-btn">Simpan Cerita</button>
        <button id="notify-me-btn">Try Notify Me 🔔</button> <!-- tombol notify -->
      </section>
    `;
  },

  async afterRender() {
    const { id } = parseActivePathname();

    this.presenter = new DetailPresenter(id, {
      view: this,
      apiModel: await import('../../utils/api'),
      db: await import('../../utils/db'),
    });

    await this.presenter.showDetail();
    await this.presenter.loadComments();

    const form = document.getElementById('comment-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const commentText = document.getElementById('comment-input').value.trim();
      if (commentText) {
        await this.presenter.postComment(commentText);
        document.getElementById('comment-input').value = '';
        await this.presenter.loadComments();
      }
    });

    document.getElementById('save-story-btn').addEventListener('click', async () => {
      await this.presenter.saveStory();
      alert('Cerita berhasil disimpan!');
      location.hash = '/saved';
    });

    // Event listener tombol Try Notify Me
    document.getElementById('notify-me-btn').addEventListener('click', () => {
      this.presenter.notifyMe();
    });
  },

  async showDetailContent(html) {
    document.getElementById('detail-content').innerHTML = html;
  },

  async showComments(commentsHtml) {
    document.getElementById('comments-list').innerHTML = commentsHtml;
  },

  showError(message) {
    document.getElementById('detail-content').innerHTML = `<p class="error">${message}</p>`;
  },
};

export default DetailPage;
