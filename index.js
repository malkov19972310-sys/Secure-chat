// 1. Подключаем библиотеку Express
const express = require('express');
const app = express();

// 2. Создаем стандартный HTTP-сервер на базе Express
const http = require('http');
const server = http.createServer(app);

// 3. Подключаем Socket.io и «привязываем» его к нашему серверу
const { Server } = require('socket.io');
const io = new Server(server);

// 4. Говорим серверу: «Если пользователь просто зашел на сайт, покажи ему текст»
const path = require('path'); // Добавьте эту строчку на самый верх файла для работы с путями

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 5. Настраиваем Socket.io: ждем, когда кто-то подключится к серверу
io.on('connection', (socket) => {
    console.log('Кто-то подключился к чату! ID пользователя:', socket.id);

    // Ловим сообщение от конкретного пользователя
    socket.on('chat message', (msg) => {
        console.log(`Получено сообщение: ${msg}`);
        
        // Пересылаем это сообщение ВСЕМ подключенным пользователям (включая отправителя)
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Пользователь отключился от чата');
    });
});
// 6. Запускаем сервер на порту 3000
// Мы явно добавляем '0.0.0.0' при запуске сервера
const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер успешно запущен на всех устройствах!`);
    console.log(`Для ПК откройте: http://localhost:${PORT}`);
    console.log(`Для телефона откройте чат по вашему локальному IP-адресу.`);
});
