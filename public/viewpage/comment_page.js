import * as FirebaseController from "../controller/firebase_controller.js";
import * as Routes from "../controller/routes.js";
import * as Element from "./element.js";
import * as Constant from "../model/constant.js";
import * as Util from "./util.js";
import * as Auth from "../controller/auth.js";

export async function comment_page(productId) {
  history.pushState(
    null,
    null,
    Routes.routePathname.COMMENTS + "#" + productId
  );
  let comments;
  let product;

  try {
    comments = await FirebaseController.getComments(productId);
    product = await FirebaseController.getProductByIdUser(productId);
  } catch (e) {
    if (Constant.DEV) console.log(e);
  }
  let html = `<h1>${product.name} Comments</h1>
	<div><button id="button-add-comment" method="post" class="btn btn-outline-danger">New Comment</button></div>
		<table class="table striped-table table-hover">
		<thead>
			<th scope="col">Recommend</th>
			<th scope="col">Time</th>
			<th scope="col">Commented By</th>
			<th scope="col">Message</th>
			<th scope="col">Actions</th>
		<thead>
		<tbody>
	`;
 
	for(let i = 0;i < comments.length;i++){
		let accountInfo = await FirebaseController.getAccountInfo(comments[i].commentor)
	if(Auth.currentUser){
		
   html += buildCommentTable(comments[i], accountInfo,Auth.currentUser);
	}else{
		html +=buildCommentTableGuest(comments[i],accountInfo)
	}	
	}

  html += `</tbody>
		</table>
	`;

  Element.mainContent.innerHTML = html;

  document
    .getElementById("button-add-comment")
    .addEventListener("click", () => {
      document.getElementById("commentorUID").value = Auth.currentUser.uid;
      document.getElementById("commentProductId").value = productId;
      Element.formAddComment.reset();
      $("#modal-add-comment").modal("show");
    });

	const deleteForms = document.getElementsByClassName("form-delete-comment")
	for(let i = 0;i<deleteForms.length;i++){
		deleteForms[i].addEventListener("submit", async e=>{
			e.preventDefault()
			const r = confirm('Are you sure you want to delete your comment?')
			if(!r) return

			await FirebaseController.deleteComment(e.target.commentId.value)
			await comment_page(e.target.productId.value)
		})
	}
	const editForms = document.getElementsByClassName("form-edit-comment")
	for(let i  =0;i<editForms.length;i++){
		editForms[i].addEventListener('submit', e=>{
			e.preventDefault()
			Element.formEditComment.commentId.value = e.target.commentId.value
			Element.formEditComment.productId.value = e.target.productId.value
			$('#modal-edit-comment').modal('show')
		})
	}

}

function buildCommentTable(comment, userInfo,currentUser) {
	let rec
	if(comment.recommend || comment.recommend == 'true') rec = 'Yes'
	else rec= 'No'
	let name
	if(userInfo.name == '') name= 'n/a'
	else name = userInfo.name

  let html = `
		<tr>
			<td>${rec}</td>
			<td>${new Date(comment.timestamp).toString()}</td>
			<td>${name}</td>
			<td>${comment.body}</td>
		`;
  if (comment.commentor == currentUser.uid) {
    html += `
			<td>
					<form class="form-delete-comment float-right" method="post">
						<input type="hidden" name="commentId" value="${comment.docId}">
						<input type="hidden" name="productId" value="${comment.productId}">
						<button class="btn btn-outline-danger">Delete</button>
						
					</form>
					<form class="form-edit-comment float-left" method="post">
						<input type="hidden" name="commentId" value="${comment.docId}">
						<input type="hidden" name="productId" value="${comment.productId}">
						<button class="btn btn-outline-secondary">Edit</button>
					</form>
				</td>
			</tr>`;
  }else if(Auth.adminCheck(currentUser.email)){
	  html+=`<td>
	 		<form class="form-delete-comment" method="post">
			 	<input type="hidden" name="commentId" value="${comment.docId}">
			 	<input type="hidden" name="productId" value="${comment.productId}">
			 	<button type="submit" class="btn btn-outline-danger">Delete</button>
			 </form> 
	  </td>`
  }
  return html;
}
function buildCommentTableGuest(comment, userInfo) {
	let rec
	if(comment.recommend) rec = 'Yes'
	else rec= 'No'

  let html = `
		<tr>
			<td>${rec}</td>
			<td>${new Date(comment.timestamp).toString()}</td>
			<td>${userInfo.name}</td>
			<td>${comment.body}</td>
		`;

  return html;
}