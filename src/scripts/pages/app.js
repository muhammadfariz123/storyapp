import { getActiveRoute } from '../routes/url-parser';
import {
  generateAuthenticatedNavigationListTemplate,
  generateSubscribeButtonTemplate,
  generateUnauthenticatedNavigationListTemplate,
  generateUnsubscribeButtonTemplate,
} from '../templates';
import { isServiceWorkerAvailable } from '../utils';
import { getAccessToken, getLogout } from '../utils/auth';
import routes from '../routes/routes';
import {
  subscribe,
  unsubscribe,
  isCurrentPushSubscriptionAvailable,
} from '../utils/notification-helper';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #skipLinkButton = null;

  constructor({ navigationDrawer, drawerButton, content, skipLinkButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#skipLinkButton = skipLinkButton;

    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      const isTargetInsideDrawer = this.#navigationDrawer.contains(event.target);
      const isTargetInsideButton = this.#drawerButton.contains(event.target);

      if (!(isTargetInsideDrawer || isTargetInsideButton)) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  #setupNavigationList() {
    const isLogin = !!getAccessToken();
    const navListMain = this.#navigationDrawer.children.namedItem('navlist-main');
    const navList = this.#navigationDrawer.children.namedItem('navlist');

    if (!navListMain || !navList) return;

    if (!isLogin) {
      navListMain.innerHTML = '';
      navList.innerHTML = generateUnauthenticatedNavigationListTemplate();
      return;
    }

    navListMain.innerHTML = ''; // kosongkan saja
    navList.innerHTML = generateAuthenticatedNavigationListTemplate();

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', (event) => {
        event.preventDefault();

        if (confirm('Apakah Anda yakin ingin keluar?')) {
          getLogout();
          location.hash = '/';
        }
      });
    }
  }

  async #setupPushNotification() {
    const pushNotificationTools = document.getElementById('push-notification-tools');
    if (!pushNotificationTools) return;

    const isSubscribed = await isCurrentPushSubscriptionAvailable();

    if (isSubscribed) {
      pushNotificationTools.innerHTML = generateUnsubscribeButtonTemplate();

      const unsubscribeBtn = document.getElementById('unsubscribe-button');
      if (unsubscribeBtn) {
        unsubscribeBtn.addEventListener('click', async () => {
          await unsubscribe();
          await this.#setupPushNotification();
        });
      }
      return;
    }

    pushNotificationTools.innerHTML = generateSubscribeButtonTemplate();

    const subscribeBtn = document.getElementById('subscribe-button');
    if (subscribeBtn) {
      subscribeBtn.addEventListener('click', async () => {
        await subscribe();
        await this.#setupPushNotification();
      });
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];

    if (!route) {
      this.#content.innerHTML = '<h2>Halaman tidak ditemukan</h2>';
      return;
    }

    if (route.render) {
      this.#content.innerHTML = await route.render();
      await route.afterRender();
    }

    this.#setupNavigationList();

    if (isServiceWorkerAvailable()) {
      await this.#setupPushNotification();
    }
  }
}

export default App;
