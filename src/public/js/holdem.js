document.addEventListener('DOMContentLoaded', () => {
  // Add smooth scrolling for channel list
  const channelList = document.querySelector('.channels');
  let isDown = false;
  let startX;
  let scrollLeft;

  channelList.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - channelList.offsetLeft;
    scrollLeft = channelList.scrollLeft;
  });

  channelList.addEventListener('mouseleave', () => {
    isDown = false;
  });

  channelList.addEventListener('mouseup', () => {
    isDown = false;
  });

  channelList.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - channelList.offsetLeft;
    const walk = (x - startX) * 2;
    channelList.scrollLeft = scrollLeft - walk;
  });
});