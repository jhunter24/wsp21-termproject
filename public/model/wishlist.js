import { Product } from "../model/product.js";
export class Wishlist {
  constructor(data) {
	  let uProducts = data.products
	  this.products = []
	  uProducts.forEach(p=>{
		let nP =	new Product({
			name: p.name,
			imageURL: p.imageURL,
			price: p.price,
			qty: 1,
			imageName: p.imageName,
			summary: p.summary,
		   
	})
	nP.docId = p.docId
		this.products.push(nP)
  })
 
}

  serialize() {
   let s = []
   this.products.forEach(p=>{
	   s.push(new Product({
		name: p.name,
		imageURL: p.imageURL,
		price: p.price,
		qty: 1,
		imageName: p.imageName,
		summary: p.summary,
		docId: p.docId
	   }))
   })

   return {products: s}
  }


  serializeForUpdate() {
    let l = {};
    let w = [];
    if (this.products) {
      this.products.forEach((p) => {
        p.qty = 1;
        w.push(p.serializeForWishlist());
      });

      l.products = w;
    }

    return l;
  }

  static instance() {
    let p = [];
    return new Wishlist({ products: [] });
  }

  addItem(product) {
	if(this.products.includes(product))return 

    this.products.push(product);
  }
}
