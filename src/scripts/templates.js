export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li><a id="login-button" href="#/">Login</a></li>
    <li><a id="register-button" href="#/register">Register</a></li>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
    <li><a id="new-report-button" class="btn new-report-button" href="#/add">
      Tambah Cerita <i class="fas fa-plus"></i>
    </a></li>

    <li><a id="saved-button" href="#/saved">Cerita Tersimpan</a></li>

    <li id="push-notification-tools" class="push-notification-tools"></li>

    <li><a id="logout-button" class="logout-button" href="#/">
      <i class="fas fa-sign-out-alt"></i> Logout
    </a></li>

    <li class="nav-list">
      <a href="#/home">Home</a>
      <a href="#/about">Tentang</a>
    </li>
  `;
}




export function generateSubscribeButtonTemplate() {
  return `
    <button id="subscribe-button" class="btn subscribe-button">
      Subscribe 🔔<i class="fas fa-bell"></i>
    </button>
  `;
}

export function generateUnsubscribeButtonTemplate() {
  return `
    <button id="unsubscribe-button" class="btn unsubscribe-button">
      Unsubscribe 🔕<i class="fas fa-bell-slash"></i>
    </button>
  `;
}
