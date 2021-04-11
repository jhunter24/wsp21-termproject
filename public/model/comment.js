export class Comment{

	constructor(data){
		this.productId = data.productId,
		this.body = data.body,
		this.timeStamp = data.timeStamp,
		this.commentor = data.commentor,
		this.recommend = data.recommend
	}

	serialize(){
		return {
			productId: this.productId,
			body: this.body,
			timeStamp: this.timeStamp,
			commentor: this.commentor,
			recommend: this.recommend
		}
	}


}