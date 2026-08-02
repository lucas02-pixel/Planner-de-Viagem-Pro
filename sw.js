// Listener para receber a ordem de mostrar a notificação
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'AGENDAR_NOTIFICACAO') {
    const { titulo, mensagem, delay, id } = event.data;

    setTimeout(() => {
      self.registration.showNotification(titulo, {
        body: mensagem,
        icon: 'favicon.png', // Verifique se a sua imagem se chama favicon.png
        badge: 'favicon.png',
        tag: id,
        vibrate: [200, 100, 200]
      });
    }, delay);
  }
});

// Listener para quando o usuário clicar na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Substitua 'SEU-USUARIO' e 'NOME-DO-REPO' pelos seus dados do GitHub
  const urlProjeto = 'https://SEU-USUARIO.github.io/NOME-DO-REPO/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlProjeto && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlProjeto);
      }
    })
  );
});
