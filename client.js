// client.js

const net = require('net');
const fs = require('fs');
const ProgressBar = require('progress');

const fileData = fs.readFileSync('file_to_send.txt');
const fileSize = fileData.length;

const client = net.connect({ port: 3000 }, () => {
  console.log('Connected to server');

  // Send the file size to the server
  client.write(fileSize.toString());

  // Send the file data to the server
  let sentSize = 0;
  const bar = new ProgressBar('Uploading [:bar] :percent :speed', {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: fileSize
  });
  const intervalId = setInterval(() => {
    const speed = (sentSize / 1024 / 1024 / 1024 * 8).toFixed(2);
    bar.tick(sentSize - bar.curr, { speed: `${speed} Gbps` });
  }, 1000);

  client.write(fileData, () => {
    clearInterval(intervalId);
    console.log('File sent');
    client.end();
  });
});

client.on('data', (data) => {
  console.log('Server response:', data);
});
