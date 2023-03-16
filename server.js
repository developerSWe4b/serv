// server.js

const net = require('net');
const fs = require('fs');
const ProgressBar = require('progress');

const server = net.createServer((socket) => {
  console.log('Client connected');

  let fileData = Buffer.alloc(0);
  let fileSize = null;

  socket.on('data', (data) => {
    if (!fileSize) {
      // First message from client is the file size
      fileSize = parseInt(data.toString());
      console.log('File size:', fileSize);
    } else {
      // Append data to buffer
      fileData = Buffer.concat([fileData, data]);
      const receivedSize = fileData.length;

      // Update progress bar
      const bar = new ProgressBar('Downloading [:bar] :percent :speed', {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: fileSize
      });
      bar.tick(receivedSize - bar.curr);

      if (receivedSize === fileSize) {
        // Write the file to disk
        fs.writeFile('received_file.txt', fileData, (err) => {
          if (err) throw err;
          console.log('File saved');
          socket.end('File received');
        });
      }
    }
  });
});

server.listen(4040, () => {
  console.log('Server listening on port 3000');
});
