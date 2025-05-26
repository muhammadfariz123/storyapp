export default class DetailPresenter {
  #storyId;
  #view;
  #apiModel;
  #db;

  constructor(storyId, { view, apiModel, db }) {
    this.#storyId = storyId;
    this.#view = view;
    this.#apiModel = apiModel.default;
    this.#db = db.default;
  }

  async showDetail() {
    try {
      console.log("Fetching story detail with ID:", this.#storyId);
      const response = await this.#apiModel.getStoryById(this.#storyId);
      console.log("Response from API:", response);

      if (!response.ok) {
        this.#view.showError(
          response.message || "Gagal mengambil data cerita."
        );
        return;
      }

      const story = response.story; // Sesuaikan dengan response API sebenarnya

      console.log("Story data:", story);

      if (!story || !story.name) {
        this.#view.showError("Data cerita tidak ditemukan atau format salah.");
        return;
      }

      const html = `
        <h3>${story.name}</h3>
        <img src="${story.photoUrl || ""}" alt="${
        story.name
      }" style="max-width: 100%; height: auto;" />
        <p>${story.description || ""}</p>
        <small>Dibuat pada: ${new Date(
          story.createdAt
        ).toLocaleString()}</small>
      `;

      await this.#view.showDetailContent(html);
    } catch (error) {
      this.#view.showError("Terjadi kesalahan: " + error.message);
    }
  }

  async loadComments() {
    try {
      const comments = await this.#db.getCommentsByStoryId(this.#storyId);
      if (!comments || comments.length === 0) {
        this.#view.showComments("<p>Belum ada komentar.</p>");
        return;
      }
      const commentsHtml = comments
        .map(
          (c) => `
        <div class="comment-item">
          <p>${c.text}</p>
          <small>${new Date(c.createdAt).toLocaleString()}</small>
        </div>
      `
        )
        .join("");
      this.#view.showComments(commentsHtml);
    } catch (error) {
      this.#view.showComments(`<p>Gagal memuat komentar: ${error.message}</p>`);
    }
  }

  async postComment(text) {
    try {
      const comment = {
        storyId: this.#storyId,
        text,
        createdAt: new Date().toISOString(),
      };
      await this.#db.addComment(comment);
    } catch (error) {
      alert("Gagal menambahkan komentar: " + error.message);
    }
  }

  async saveStory() {
    try {
      const response = await this.#apiModel.getStoryById(this.#storyId);
      if (!response.ok) {
        alert("Gagal mengambil data cerita untuk disimpan.");
        return;
      }
      const story = response.story;
      if (!story.id) {
        alert("Data cerita tidak valid.");
        return;
      }
      await this.#db.addStory(story);
    } catch (error) {
      alert("Gagal menyimpan cerita: " + error.message);
    }
  }

  async notifyMe() {
    try {
      // Cek apakah permission sudah granted
      if (Notification.permission !== "granted") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          alert("Izin notifikasi belum diberikan.");
          return;
        }
      }

      // Tampilkan notifikasi langsung dari service worker registration
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification("Notifikasi Cerita", {
        body: "Ini adalah notifikasi simulasi untuk cerita saat ini.",
        icon: "/icons/icon-192x192.png", // sesuaikan dengan ikon aplikasi
      });

      console.log("Notifikasi berhasil dipicu.");
    } catch (error) {
      console.error("notifyMe: error:", error);
      alert("Terjadi kesalahan saat mengirim notifikasi.");
    }
  }
}
