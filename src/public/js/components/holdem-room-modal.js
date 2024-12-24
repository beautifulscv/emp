import { holdemService } from '../services/holdemService.js';

export function initHoldemRoomModal() {
  const modal = document.getElementById('holdemRoomModal');
  const closeBtn = modal.querySelector('.close');
  const roomListBody = document.getElementById('roomListBody');
  const autoJoinBtn = document.getElementById('autoJoinButton');
  
  let isAutoJoinActive = false;
  let autoJoinInterval = null;

  // Close modal handlers
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    stopAutoJoin();
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
      stopAutoJoin();
    }
  });

  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Enter room function
  function enterRoom(roomId) {
    window.open('https://google.com', '_blank', 'width=1024,height=768');
  }

  // Auto-join functionality
  function startAutoJoin() {
    isAutoJoinActive = true;
    autoJoinBtn.classList.add('active');
    autoJoinBtn.textContent = '자동 참여 중지';

    autoJoinInterval = setInterval(() => {
      const availableRooms = Array.from(roomListBody.querySelectorAll('tr')).map(row => ({
        id: row.querySelector('.room-number').textContent,
        isFull: row.querySelector('.player-count').classList.contains('full'),
        isLocked: row.querySelector('.lock-icon') !== null
      }));

      const availableRoom = availableRooms.find(room => !room.isLocked && !room.isFull);
      if (availableRoom) {
        enterRoom(availableRoom.id);
        stopAutoJoin();
      }
    }, 2000);
  }

  function stopAutoJoin() {
    isAutoJoinActive = false;
    autoJoinBtn.classList.remove('active');
    autoJoinBtn.textContent = '자동 참여';
    if (autoJoinInterval) {
      clearInterval(autoJoinInterval);
      autoJoinInterval = null;
    }
  }

  // Auto-join button handler
  autoJoinBtn.addEventListener('click', () => {
    if (isAutoJoinActive) {
      stopAutoJoin();
    } else {
      startAutoJoin();
    }
  });

  // Update room list
  function updateRoomList(rooms) {
    roomListBody.innerHTML = rooms.map(room => `
      <tr>
        <td class="room-number">${room.id}</td>
        <td>
          <span class="player-count ${room.currentPlayers === room.maxPlayers ? 'full' : ''}">
            ${room.currentPlayers}/${room.maxPlayers}
          </span>
        </td>
        <td class="buy-in">${formatNumber(room.buyIn)}</td>
        <td class="big-blind">${formatNumber(room.bigBlind)}</td>
        <td>
          ${room.isLocked ? '<span class="lock-icon">🔒</span>' : ''}
        </td>
        <td>
          <button class="enter-button font-kr" 
                  ${room.currentPlayers === room.maxPlayers ? 'disabled' : ''}
                  onclick="window.open('https://google.com', '_blank', 'width=1024,height=768')">
            입장
          </button>
        </td>
      </tr>
    `).join('');
  }

  // Connect to Colyseus server
  async function connectToServer() {
    const connected = await holdemService.connect('wss://your-colyseus-server.com');
    if (connected) {
      holdemService.addListener(updateRoomList);
    } else {
      console.error('Failed to connect to game server');
    }
  }

  return {
    async show() {
      modal.style.display = 'block';
      await connectToServer();
    },
    hide() {
      modal.style.display = 'none';
      stopAutoJoin();
      holdemService.disconnect();
    }
  };
}