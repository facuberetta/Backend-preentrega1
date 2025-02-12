import express from "express";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import path from 'path';


const app = express();
app.use('/static', express.static(path.join(process.cwd(), "src", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.listen(8080, () => console.log("server ok puerto 8080"));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

let products = [];

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.emit('updateProducts', products);

    socket.on('addProduct', (product) => {
        products.push(product);
        io.emit('updateProducts', products);
    });

    socket.on('deleteProduct', (id) => {
        products = products.filter((p) => p.id !== id);
        io.emit('updateProducts', products);
    });
});
