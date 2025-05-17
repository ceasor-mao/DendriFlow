import { createApp } from 'vue';
import App from './App.vue';


const app = createApp(App)
app.mount('#app');

window.themeMode.onUpdateTheme((value) => {
  if (value === 'dark' || value === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
  console.log('Theme updated:', value);
})
