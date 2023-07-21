const installEvent = () => {
    self.addEventListener('install', () => {
      console.log('service worker installed');
    });
  };
  installEvent();
  
  const activateEvent = () => {
    self.addEventListener('activate', () => {
      console.log('service worker activated');
    });
  };
  activateEvent();

  self.addEventListener('push', event => {
    const notificationData = event.data.text();

    const title = "Glyph";
    const options = {
        body: notificationData
    };

    event.waitUntil(self.registration.showNotification(title, options));
});