import express from "express";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import path from 'path';
import { Server } from "socket.io";
import { createServer } from "http";
import { fileURLToPath } from 'url';
import mongoose from "mongoose";
import Product from './models/product.model.js';
import { engine } from 'express-handlebars';
import { User } from './models/user.js';
import userRouter from "./routes/user.router.js";
import passport from "passport";
import "./config/passport.js"




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

const MONGO_URI = 'mongodb://127.0.0.1:27017/ecommerce';
mongoose.connect(MONGO_URI, {
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch((error) => console.error('❌ Error al conectar a MongoDB:', error));

// Middleware y rutas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use('/static', express.static(path.join(__dirname, "src", "public")));
app.use("/api/users", userRouter);
app.use(passport.initialize());


// Configurar Handlebars
app.engine("handlebars", engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.get('/testMongo', async (req, res) => {
    try {
        const nuevoProducto = await Product.create({
            title: "Producto de prueba",
            description: "Este es un producto de prueba",
            price: 100,
            category: "Tecnología",
            stock: 10
        });
        res.send(nuevoProducto);
    } catch (error) {
        res.status(500).send("Error al guardar el producto");
    }
});

// WebSockets
io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    socket.on('addProduct', (product) => {
        io.emit('updateProducts', product);
    });

    socket.on('deleteProduct', (id) => {
        io.emit('updateProducts', id);
    });
});

// Iniciar el servidor
server.listen(8080, () => {
    console.log("🚀 Server is running on port 8080");
});
