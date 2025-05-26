import { convertBase64ToUint8Array } from './index';
import { VAPID_PUBLIC_KEY } from '../config';
import StoryApi from '../data/story-api'; // pastikan path benar

export function isNotificationAvailable() {
  return 'Notification' in window;
}

export function isNotificationGranted() {
  return Notification.permission === 'granted';
}

export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error('Notification API unsupported.');
    return false;
  }

  if (isNotificationGranted()) {
    return true;
  }

  const status = await Notification.requestPermission();

  if (status === 'denied') {
    alert('Izin notifikasi ditolak.');
    return false;
  }

  if (status === 'default') {
    alert('Izin notifikasi ditutup atau diabaikan.');
    return false;
  }

  return true;
}

export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return null;
  return await registration.pushManager.getSubscription();
}

export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}

export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(VAPID_PUBLIC_KEY),
  };
}

export async function subscribe() {
  if (!(await requestNotificationPermission())) {
    return;
  }

  if (await isCurrentPushSubscriptionAvailable()) {
    alert('Sudah berlangganan push notification.');
    return;
  }

  console.log('Mulai berlangganan push notification...');

  const failureSubscribeMessage = 'Langganan push notification gagal diaktifkan.';
  const successSubscribeMessage = 'Langganan push notification berhasil diaktifkan.';
  let pushSubscription;
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) throw new Error('Service worker belum terdaftar');
    pushSubscription = await registration.pushManager.subscribe(generateSubscribeOptions());
    const { endpoint, keys } = pushSubscription.toJSON();

    const response = await StoryApi.subscribePushNotification({ endpoint, keys });
    if (!response.ok) {
      console.error('subscribe: response:', response);
      alert(failureSubscribeMessage);
      await pushSubscription.unsubscribe();
      return;
    }

    alert(successSubscribeMessage);
  } catch (error) {
    console.error('subscribe: error:', error);
    alert(failureSubscribeMessage);
    if (pushSubscription) {
      await pushSubscription.unsubscribe();
    }
  }
}

export async function unsubscribe() {
  const failureUnsubscribeMessage = 'Berhenti langganan push notification gagal.';
  const successUnsubscribeMessage = 'Berhenti langganan push notification berhasil.';

  try {
    const subscription = await getPushSubscription();
    if (!subscription) {
      alert('Anda belum berlangganan.');
      return;
    }
    const { endpoint, keys } = subscription.toJSON();

    const response = await StoryApi.unsubscribePushNotification({ endpoint });

    if (!response.ok) {
      console.error('unsubscribe: response:', response);
      alert(failureUnsubscribeMessage);
      return;
    }

    const unsubscribed = await subscription.unsubscribe();
    if (!unsubscribed) {
      alert('Gagal berhenti berlangganan di browser.');
      // Jika gagal unsubscribe di browser, bisa coba subscribe ulang ke server agar konsisten
      await StoryApi.subscribePushNotification({ endpoint, keys });
      return;
    }

    alert(successUnsubscribeMessage);
  } catch (error) {
    console.error('unsubscribe: error:', error);
    alert(failureUnsubscribeMessage);
  }
}
