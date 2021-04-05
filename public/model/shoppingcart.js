import { Product } from "./product.js";

export class ShoppingCart{

	constructor(uid){
		this.uid = uid;
		this.items // array of serialized products
	}

	addItem(product){
		if(!this.items)this.items = []

		const item = this.items.find(element => {return product.docId == element.docId;})
		if(item){
			++product.qty
			++item.qty
		}else{
			// new item
			product.qty = 1;
			const newItem = product.serialize()
			newItem.docId = product.docId;

			this.items.push(newItem);
		}
		this.saveToLocalStorage()
	}

	removeItem(product){
		//dec qty or remove item from list
		const index = this.items.findIndex(ele => {return product.docId == ele.docId})

		if(index >= 0){
			--this.items[index].qty
			--product.qty
			if(product.qty==0){
				this.items.splice(index,1);
			}
		}

		this.saveToLocalStorage()
	}


	saveToLocalStorage(){
			window.localStorage.setItem(`cart-${this.uid}` ,this.stringify())
		}
	stringify(){
			return JSON.stringify({uid: this.uid, items: this.items})
		}

	static parse(cartString){
		try{
			const obj = JSON.parse(cartString)
			const sc = new ShoppingCart(obj.uid);
			sc.items = obj.items
			return sc
		}catch(e){
			return null
		}

	}

	isValid(){
		if(!this.uid || typeof this.uid != 'string') return false
		if(!this.items || !Array.isArray(this.items)) return false
		for(let i = 0 ;i < this.items.length;i++){
			if(!Product.isSerializedProduct(this.items[i]))return false
		}
		return true
	}

	getTotalQty(){
		if(!this.items) return 0;
		let n = 0;
		this.items.forEach(item => {
			 n+= item.qty;
			 
		})
		return n;
	}


	getTotalPrice(){
		if(!this.items) return 0;

		let total = 0;


		this.items.forEach(item =>{
			total += item.price * item.qty;

		})
		return total
	}

	static deserialize(data){
		const sc = new ShoppingCart(data.uid)
		sc.items = data.items
		sc.timestamp = data.timestamp

		return sc
	}

	serialize(timestamp){
		return {
			uid: this.uid,
			items: this.items
			,timestamp
		}
	}


	empty(){
		this.items = null
	}
}