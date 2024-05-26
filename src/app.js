import  express  from "express";
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js'
const app = express()

const PORT = process.env.PORT || 8080 ;

app.listen(PORT, ()=>console.log(`listening on port ${PORT}`))

app.use(express.json());

app.use(express.static('./src/public'))

app.use('/api/products', productsRouter)


app.use('/api/cart', cartRouter)