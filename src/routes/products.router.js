import { Router }  from "express";
import uploader from "../middlewares/uploader.js";
import fileSystem from "fs";

const router = Router();

const loadProducts = () => {
  if (fileSystem.existsSync('./products.json')){
    const data = fileSystem.readFileSync('./products.json', 'utf-8');
    return JSON.parse(data)
  } else {
    return  [
      { "id": 1, "name": "Alfajor de chocolate", "quantity": 20, "price": 25, "category": "Dulces", "description": "Delicioso alfajor relleno de dulce de leche y cubierto de chocolate." },
      { "id": 2, "name": "Chocolate", "quantity": 15, "price": 30, "category": "Dulces", "description": "Tableta de chocolate negro de alta calidad." },
      { "id": 3, "name": "Caramelos surtidos", "quantity": 10, "price": 10, "category": "Dulces", "description": "Paquete de caramelos de varios sabores: frutilla, limón, naranja y menta." },
      { "id": 4, "name": "Gomitas de ositos", "quantity": 18, "price": 15, "category": "Dulces", "description": "Gomitas suaves con forma de ositos, ideales para disfrutar como snack." },
      { "id": 5, "name": "Papas fritas", "quantity": 25, "price": 20, "category": "Snacks", "description": "Bolsa de papas fritas crujientes y sabrosas." }
      ]
    }
  }

const saveProducts = (products) => {
    fileSystem.writeFileSync('./products.json', JSON.stringify(products, null, 2))
}
const deleteProductById = (productId) => {
  const index = products.findIndex(p => p.id === productId);
  if (index !== -1) {
    products.splice(index, 1);
    saveProducts(products);
    return true;
  }
  return false;
}


let products = loadProducts()

router.get('/',(req,res)=>{
    const limit = parseInt(req.query.limit); 

    if (!isNaN(limit) && limit > 0) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
})
router.get('/:pid',(req, res)=>{
    const pid = req.params.pid;
    const productId = parseInt(pid);
    const product = products.find(p=>p.id === productId)
    if(!product){
        return res.status(404).send({status:"error", error:"product not found"})
    }
      

    res.send(product);
})

router.post('/',uploader.single('data'),(req,res)=>{
  console.log(req.file)
  console.log(req.body);
  const newProduct = ({
    id : products[products.length-1].id+1, 
    name:req.body.name,
    title:req.body.title,
    description:req.body.description,
    code:req.body.code,
    price:parseInt(req.body.price),
    status:req.body.status === 'true' || req.body.status === '1',
    stock:parseInt(req.body.stock),
    category:req.body.category
  })
  products.push(newProduct)
  res.send("Producto agregado");
  console.log(products)
  saveProducts(products)
})

 router.put('/:pid', uploader.single('data'),(req, res)=>{
  const pid = req.params.pid;
  const productId = parseInt(pid);
  const productIndex = products.findIndex(p=>p.id === productId)
  if(productIndex === -1){
      return res.status(404).send({status:"error", error:"product not found"})
  }
  products[productIndex] = {
    ...products[productIndex],
    name: req.body.name,
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    price: parseInt(req.body.price),
    status: req.body.status === 'true' || req.body.status === '1',
    stock: parseInt(req.body.stock),
    category: req.body.category
  };

  saveProducts(products);

  res.send(products[productIndex]);
 
})

  router.delete('/:pid', (req, res) => {
  const pid = req.params.pid;
  const productId = parseInt(pid);
  const deleted = deleteProductById(productId);
  if (deleted) {
    res.send({ status: "success", message: "Producto eliminado correctamente" });
  } else {
    res.status(404).send({ status: "error", error: "product not found" });
  }
});



export default router