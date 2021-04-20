
import * as Routes from "../controller/routes.js"
import * as FirebaseController from "../controller/firebase_controller.js"
import * as Element from "./element.js"
import * as Constant from "../model/constant.js"
import * as Util from "./util.js"
import * as Auth from "../controller/auth.js"
import { Wishlist } from "../model/wishlist.js"
import * as HomePage from "./home_page.js"
import { ShoppingCart } from "../model/shoppingcart.js"
export async function addEventListeners(){


	

	Element.menuButtonWishlist.addEventListener('click', async e=>{		
		history.pushState(null,null,Routes.routePathname.WISHLIST)
		let label = Util.disableButton(Element.menuButtonWishlist)
		await wishlist_page()
		Util.enableButton(Element.menuButtonWishlist,label)
		getShoppingCart()
		
		
		
	})

}
let cart
export async function wishlist_page(){
	let wishlist = await FirebaseController.getWishlist(Auth.currentUser.uid);
	let html = `<div class="row"><h1>Wishlist</h1></div>

	<div class="row">
	
	
<table class="table">
  <thead class="table-dark">
	<th scope="col">Image</th>
	<th scope="col">ProductName</th>
	<th scope="col">Unit Price</th>
	<th scope="col">Summary</td>
	<th scope="col">Actions</th>
  </thead>
  <tbody>
   
 
`
	wishlist.products.forEach(p=>{
		html += buildTable(p)

	})

html += ` </tbody>
	</table>`




	Element.mainContent.innerHTML = html


	const removeForms = document.getElementsByClassName("remove-from-wishlist-form")
	for(let i = 0;i<removeForms.length;i++){
		removeForms[i].addEventListener("submit", async e=>{
			e.preventDefault()
			try{let product = wishlist.products.find((p) => {
				return e.target.productId.value == p.docId;
			  });
			let index = wishlist.products.indexOf(product)
			wishlist.products.splice(index,1)
			await FirebaseController.updateWishlist(Auth.currentUser.uid,wishlist)
			await wishlist_page()
		}catch(e){
				if(Constant.DEV) console.log(e)
			}
		})
		

			}
	const toCartForms = document.getElementsByClassName("add-to-cart-form")
	for(let i = 0;i<toCartForms.length;i++){
		toCartForms[i].addEventListener("submit",async e=>{
			e.preventDefault()
			try{
			let product = wishlist.products.find((p) => {
				return e.target.productId.value == p.docId;
			  });
			let index = wishlist.products.indexOf(product)
			wishlist.products.splice(index,1)
			await FirebaseController.updateWishlist(Auth.currentUser.uid,wishlist)

			
			cart.addItem(product)
			Element.shoppingcartCount.innerHTML = cart.getTotalQty();  

			await wishlist_page()
			}catch(e){
				if(Constant.DEV) console.log(e)
			} 
		})
		
	}




}



function buildTable(p){
	return `
			<tr>
				<td><img src="${p.imageURL}" width="300px" height="300px"></td>
				<td>${p.name}</td>
				<td>${Util.currency(p.price)}</td>
				<td>${p.summary}</td>
				<td>
					<form class="add-to-cart-form d-inline">
						<input type="hidden" name="productId" value="${p.docId}">
						<button class="btn btn-outline-primary">Add to Cart</button>
					</form>
					<form class="remove-from-wishlist-form d-inline">
						<input type="hidden" name="productId" value="${p.docId}">
						<button class="btn btn-outline-danger">Remove</button>
					</form>
				</td>
			</tr>

		`
}



function getShoppingCart(){
	const cartStr = window.localStorage.getItem(`cart-${Auth.currentUser.uid}`);

  cart = ShoppingCart.parse(cartStr);
  if (!cart || !cart.isValid() || Auth.currentUser.uid != cart.uid) {
    window.localStorage.removeItem(`cart-${Auth.currentUser.uid}`);
    cart = new ShoppingCart(Auth.currentUser.uid);
  }
}
