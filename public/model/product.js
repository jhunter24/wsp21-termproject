export class Product{

	constructor(data){

		this.name = data.name.toLowerCase()
		this.price = typeof data.price =='number' ? data.price: Number(data.price)
		this.summary = data.summary
		this.imageName = data.imageName
		this.imageURL = data.imageURL
		this.qty = data.qty
	}




	serialize(){

		return {
			name: this.name,
			price: this.price,
			summary: this.summary,
			imageName: this.imageName,
			imageURL: this.imageURL,
			qty: this.qty,
		}


	}


	static isSerializedProduct(obj){
		if(!obj.name || typeof obj.name != 'string') return false
		if(!obj.price || typeof obj.price != 'number') return false
		if(!obj.summary || typeof obj.summary != 'string') return false
		if(!obj.imageName || typeof obj.imageName != 'string')return false
		if(!obj.imageURL || !obj.imageURL.includes('https')) return false
		if(!obj.qty || typeof obj.qty != 'number') return false


		return true
	}
}