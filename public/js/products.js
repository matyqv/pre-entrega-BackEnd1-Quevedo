import fs from "fs";

class productsManager{
    static products=[];
    static pathFile = "./src/data/products.data.json";


    static initialize = async () => {
        try {
          const fileData = await fs.promises.readFile(this.pathFile, "utf-8");
          this.products = JSON.parse(fileData);
          console.log("Datos cargados correctamente!");
       //   console.log(this.products)
        } catch (error) {
          console.error(error);
        }
    } 

    static saveProducts = async () => {
        try {
          await fs.promises.writeFile(this.pathFile, JSON.stringify(this.products, null, 2), "utf-8");
        } catch (error) {
          console.error("Error al guardar usuario en json");
        }
      }

    static addObject=(x)=>{
        this.products.push(x);
        console.log(this.products); 
        this.saveProducts();
    }

    static deleteProduct=(id)=>{
      const filteredProducts = this.products.filter(product => product.id !== id);
      this.products=filteredProducts;
      this.saveProducts();
    }


    //Generacion de Id
    static SegundosAbsolutosDeFecha=()=> {
      const now = new Date(); // Fecha actual
      const seconds = Math.floor(now.getTime() / 100); // Convertir a milisegundos y luego a segundos
      return seconds;
  }
  
  static GenerarIDUnica=()=>{
      const seconds = this.SegundosAbsolutosDeFecha(); // Obtener los segundos actuales
      const alphanumericId = seconds.toString(36); // Convertir los segundos a base 36
      return alphanumericId;
  }
}
export default productsManager;