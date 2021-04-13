import * as Element from "../viewpage/element.js"
import * as FirebaseController from "../controller/firebase_controller.js"
import { Comment } from "../model/comment.js"
import * as CommentPage from "../viewpage/comment_page.js"


export function addEventListeners(){
	Element.formEditComment.addEventListener('submit', async e=>{
		e.preventDefault()
		
		let comment = new Comment({body:e.target.body.value,recommend: e.target.recommend.value,productId:e.target.productId.value})
		comment.docId = e.target.commentId.value
		



		await FirebaseController.updateComment(comment)
		await CommentPage.comment_page(comment.productId)
	})
}