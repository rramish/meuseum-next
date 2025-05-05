import next from "next";
import { Server } from "socket.io";
import { createServer } from "node:http";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT 
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on("connection", (socket) => {

        console.log("New client connected", socket.id);
        socket.on('image-updated-backend', (data) => {
            console.log('Received image-updated event from:', socket.id, data);
            io.sockets.emit('image-updated', {
                data: 'some data'
            });
        });
        socket.on('image-updated-user', (data) => {
            console.log('Received image-updated event from:', socket.id, data);
            io.sockets.emit('image-updated-admin', {
                data: 'some data'
            });
        });
    });



    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});