export class Comment{

	constructor(data){
		this.productId = data.productId,
		this.body = data.body,
		this.commentor = data.commentor,
		this.recommend = data.recommend
	}

	serialize(timestamp){
		return {
			productId: this.productId,
			body: this.body,
			commentor: this.commentor,
			recommend: this.recommend,
			timestamp
		}
	}


	serializeForUpdate() {
		const p = {};
		if (this.body) p.body = this.body;
		if( this.recommend) p.recommend = this.recommend
		this.timestamp = Date.now()
	
	
		return p;
	  }

	  static deserialize(data){
		  const c = new Comment(data)
		  c.timestamp = data.timestamp
		  return c
	  }
}