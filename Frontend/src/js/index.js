import '../asset/style.css';
import App from './app';

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();

  window.app = app;
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(
      '/WebWorkers-ServiceWorkers/service-worker.js'
    )
      .then(registration => {
        console.log('Service Worker registered:', registration);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}