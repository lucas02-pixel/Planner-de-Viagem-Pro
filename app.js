// 1. Registrar o Service Worker ao carregar a página
if ('serviceWorker' in navigator && 'Notification' in window) {
  navigator.serviceWorker.register('sw.js').then((reg) => {
    console.log('Service Worker registrado com sucesso!');
  }).catch((err) => {
    console.error('Erro ao registrar Service Worker:', err);
  });
}

// 2. Pedir permissão para enviar notificações
function pedirPermissaoNotificacao() {
  if ('Notification' in window) {
    Notification.requestPermission().then((perm) => {
      if (perm === 'granted') {
        alert('Notificações ativadas com sucesso!');
      } else {
        alert('Você precisa permitir as notificações para receber os avisos de check-in.');
      }
    });
  }
}

// 3. Função para agendar as notificações de 2h e 1h antes
function agendarNotificacoesCheckIn(dataHoraCheckIn, nomeHotel) {
  if (!('serviceWorker' in navigator) || Notification.permission !== 'granted') {
    return;
  }

  const tempoCheckIn = new Date(dataHoraCheckIn).getTime();
  const agora = new Date().getTime();

  const UMA_HORA = 60 * 60 * 1000;
  const DUAS_HORAS = 2 * UMA_HORA;

  const tempoPara2Horas = (tempoCheckIn - DUAS_HORAS) - agora;
  const tempoPara1Hora = (tempoCheckIn - UMA_HORA) - agora;

  navigator.serviceWorker.ready.then((reg) => {
    // Agendar Notificação de 2 Horas Antes
    if (tempoPara2Horas > 0) {
      reg.active.postMessage({
        type: 'AGENDAR_NOTIFICACAO',
        titulo: '🏨 Traveling - Check-in Próximo!',
        mensagem: `Faltam 2 horas para o seu check-in no ${nomeHotel}!`,
        delay: tempoPara2Horas,
        id: `checkin-2h-${nomeHotel}`
      });
    }

    // Agendar Notificação de 1 Hora Antes
    if (tempoPara1Hora > 0) {
      reg.active.postMessage({
        type: 'AGENDAR_NOTIFICACAO',
        titulo: '⏰ Traveling - Quase Hora do Check-in!',
        mensagem: `Falta apenas 1 hora para o seu check-in no ${nomeHotel}!`,
        delay: tempoPara1Hora,
        id: `checkin-1h-${nomeHotel}`
      });
    }
  });
}

// 4. Função principal de salvar a viagem
function salvarViagem(nomeHotel, dataHoraCheckIn) {
  const novaViagem = {
    hotel: nomeHotel,
    checkIn: dataHoraCheckIn
  };

  // Salva no localStorage existente
  const viagensSalvas = JSON.parse(localStorage.getItem('viagens') || '[]');
  viagensSalvas.push(novaViagem);
  localStorage.setItem('viagens', JSON.stringify(viagensSalvas));

  // Dispara o agendamento do temporizador
  agendarNotificacoesCheckIn(dataHoraCheckIn, nomeHotel);
}
function pedirPermissaoNotificacao() {
  // Verifica se o navegador suporta notificações
  if (!('Notification' in window)) {
    alert('Seu navegador não suporta notificações.');
    return;
  }

  // Isso aqui faz o POP-UP PADRÃO do navegador abrir na tela
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      console.log('Permissão concedida pelo usuário!');
    } else if (permission === 'denied') {
      console.log('Usuário bloqueou as notificações.');
    }
  });
}
