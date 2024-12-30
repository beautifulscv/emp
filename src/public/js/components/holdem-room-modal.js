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
    console.log("initializeMonitoring")
    try {
      // Using global Colyseus object
      client = new Colyseus.Client(window.monitorUrl);
      monitorRoom = await client.joinOrCreate("monitor_room");

      // Listen for room list updates
      monitorRoom.onMessage("rooms_list", (roomList) => {
        console.log("Received room list update:", roomList)
        updateRoomList(roomList);
      });
    } catch (error) {
      console.error("Error connecting to monitor room:", error);
    }
  }

  function handleJoinRoom(roomId) {
    console.log(`Joining room: ${roomId}`);
    pokerStart(roomId); // Call the existing pokerStart function with roomId
  }

  // Update the updateRoomList function to add the "참여" button
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
                    참여
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
    pokerStart(roomId);
  }
  // Modify the pokerStart function to work with room IDs

  // Handle auto join functionality
  function handleAutoJoin() {
    const availableRooms = Array.from(roomListBody.querySelectorAll('tr'))
        .filter(row => {
          const joinButton = row.querySelector('.join-button');
          return !joinButton.disabled;
        })
        .map(row => {
          // Extract information from each cell
          const cells = row.querySelectorAll('td');
          const joinButton = row.querySelector('.join-button');

          return {
            roomId: joinButton.dataset.roomId,
            clientCount: cells[1].textContent,
            baseBlind: cells[2].textContent,
            maxBlind: cells[3].textContent,
            isLocked: cells[4].textContent === '🔒'
          };
        });

    console.log('availableRooms:', JSON.stringify(availableRooms));

    if (availableRooms.length > 0) {
      // Join the first available room
      const roomToJoin = availableRooms[0];
      console.log('Joining room:', roomToJoin);
      window.pokerStart(roomToJoin.roomId);
    } else {
      alert("현재 참여 가능한 방이 없습니다."); // No available rooms message in Korean
    }

/*    if (availableRooms.length > 0) {
      const randomRoom = availableRooms[Math.floor(Math.random() * availableRooms.length)];
      const roomId = randomRoom.querySelector('.join-button').dataset.roomId;
      handleJoinRoom(roomId);
    }*/
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
