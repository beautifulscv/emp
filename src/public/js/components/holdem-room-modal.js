// holdem-room-modal.js

// Make it a global function instead of an export
window.initHoldemRoomModal = function() {
  const modal = document.getElementById('holdemRoomModal');
  const closeBtn = modal.querySelector('.close');
  const roomListBody = document.getElementById('roomListBody');
  const autoJoinButton = document.getElementById('autoJoinButton');

  let client;
  let monitorRoom;

  // Initialize Colyseus client and connect to monitor room
  async function initializeMonitoring() {
    try {
      // Using global Colyseus object
      client = new Colyseus.Client(window.monitorUrl);
      monitorRoom = await client.joinOrCreate("monitor_room");

      // Listen for room list updates
      monitorRoom.onMessage("rooms_list", (roomList) => {
        updateRoomList(roomList);
      });
    } catch (error) {
      console.error("Error connecting to monitor room:", error);
    }
  }

  // Update room list UI
  function updateRoomList(roomList) {
    roomListBody.innerHTML = '';

    roomList.forEach(room => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${room.roomId}</td>
        <td>${room.clients}/${room.maxClients}</td>
        <td>${formatCurrency(room.baseBlindAmount)}</td>
        <td>${formatCurrency(room.baseBlindAmount * 2)}</td>
        <td>${room.locked ? '🔒' : '🔓'}</td>
        <td>
          <button class="join-button font-kr" data-room-id="${room.roomId}"
            ${room.clients >= room.maxClients || room.locked ? 'disabled' : ''}>
            입장
          </button>
        </td>
      `;

      // Add join button click handler
      const joinButton = row.querySelector('.join-button');
      joinButton.addEventListener('click', () => handleJoinRoom(room.roomId));

      roomListBody.appendChild(row);
    });
  }

  // Format currency with Korean won
  function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  }

  // Handle room join
  function handleJoinRoom(roomId) {
    // Implement your room joining logic here
    console.log(`Joining room: ${roomId}`);
    // Example: window.location.href = `/game/holdem/${roomId}`;
  }

  // Handle auto join functionality
  function handleAutoJoin() {
    const availableRooms = Array.from(roomListBody.querySelectorAll('tr'))
        .filter(row => {
          const joinButton = row.querySelector('.join-button');
          return !joinButton.disabled;
        });

    if (availableRooms.length > 0) {
      const randomRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)];
      const roomId = randomRoom.querySelector('.join-button').dataset.roomId;
      handleJoinRoom(roomId);
    }
  }

  // Modal controls
  function show() {
    modal.style.display = 'block';
    initializeMonitoring();
  }

  function hide() {
    modal.style.display = 'none';
    if (monitorRoom) {
      monitorRoom.leave();
    }
  }

  // Event listeners
  closeBtn.addEventListener('click', hide);
  autoJoinButton.addEventListener('click', handleAutoJoin);

  // Close modal when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      hide();
    }
  });

  return {
    show,
    hide
  };
};
