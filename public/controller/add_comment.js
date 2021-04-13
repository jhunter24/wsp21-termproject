import * as Element from "../viewpage/element.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "../viewpage/util.js";
import * as CommentPage from "../viewpage/comment_page.js";
import { Comment } from "../model/comment.js"

export function addEventListeners(){
	
	Element.formAddComment.addEventListener('submit', async e=>{
		e.preventDefault();
		let id = e.target.productId.value
		await addComment(e)
		await CommentPage.comment_page(id)
	})
}


async function addComment(e){
	let commentor = e.target.commentor.value
	let recommend
	if(e.target.recommend.value == 'true') recommend = true
	else recommend = false
	let body = e.target.body.value
	let productId = e.target.productId.value
	const comment = new Comment({productId,body,commentor,recommend})
	try{
		await FirebaseController.storeComment(comment)
		Util.popupInfo('Success',"Successful comment",'modal-add-comment')
	}catch(e){
		if(Constant.DEV) console.log(e)
		Util.popupInfo('Error adding',JSON.stringify(e),'modal-add-comment')
		return
	}
}