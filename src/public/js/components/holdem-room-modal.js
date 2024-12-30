// holdem-room-modal.js

window.initHoldemRoomModal = function() {
  const modal = document.getElementById('holdemRoomModal');
  const closeBtn = modal.querySelector('.close');
  const roomListBody = document.getElementById('roomListBody');
  const autoJoinButton = document.getElementById('autoJoinButton');

  let client;
  let monitorRoom;
  let currentChannelId = null;

  async function initializeMonitoring() {
    console.log("initializeMonitoring")
    try {
      client = new Colyseus.Client(window.monitorUrl);
      monitorRoom = await client.joinOrCreate("monitor_room");

      monitorRoom.onMessage("rooms_list", (roomList) => {
        console.log("Received room list update:", roomList);
        // Filter rooms by channelId before updating the list
        const filteredRooms = roomList.filter(room =>
            currentChannelId ? room.channelId === currentChannelId : true
        );
        updateRoomList(filteredRooms);
      });
    } catch (error) {
      console.error("Error connecting to monitor room:", error);
    }
  }

  function handleJoinRoom(roomId) {
    console.log(`Joining room: ${roomId}`);
    pokerStart(roomId);
  }

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

      const joinButton = row.querySelector('.join-button');
      joinButton.addEventListener('click', () => handleJoinRoom(room.roomId));

      roomListBody.appendChild(row);
    });
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  }

  function handleAutoJoin() {
    const availableRooms = Array.from(roomListBody.querySelectorAll('tr'))
        .filter(row => {
          const joinButton = row.querySelector('.join-button');
          return !joinButton.disabled;
        })
        .map(row => {
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
      const roomToJoin = availableRooms[0];
      console.log('Joining room:', roomToJoin);
      window.pokerStart(roomToJoin.roomId);
    } else {
      alert("현재 참여 가능한 방이 없습니다.");
    }
  }

  function show(channelId) {
    // alert(channelId)
    currentChannelId = channelId;
    modal.style.display = 'block';
    initializeMonitoring();
  }

  function hide() {
    modal.style.display = 'none';
    if (monitorRoom) {
      monitorRoom.leave();
    }
    currentChannelId = null;
  }

  closeBtn.addEventListener('click', hide);
  autoJoinButton.addEventListener('click', handleAutoJoin);

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
