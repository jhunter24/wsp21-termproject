import * as Element from "./element.js";
import * as Routes from "../controller/routes.js";
import * as FirebaseController from "../controller/firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "./util.js";
import * as Auth from "../controller/auth.js";
import { ShoppingCart } from "../model/shoppingcart.js";
import * as CommentPage from "./comment_page.js"
import { Wishlist } from "../model/wishlist.js"

export function addEventListeners() {
  Element.menuButtonHome.addEventListener("click", async () => {
    history.pushState(null, null, Routes.routePathname.HOME);
    const label = Util.disableButton(Element.menuButtonHome);
    await home_page();
    Util.enableButton(Element.menuButtonHome, label);
  });
}

let products;
export let wishlist;
export let cart;
export async function home_page() {
  let html = `<h1>Home Page</h1>
  `;

  //if signed in make a new cart
  //if(Auth.currentUser){
  //	  cart = new ShoppingCart(Auth.currentUser.uid);
  //}
	

  try {
    products = await FirebaseController.getProductList();
    if (cart && cart.items) {
      cart.items.forEach((item) => {
        const product = products.find((p) => {
          return item.docId == p.docId;
        });
        product.qty = item.qty;
      });
    }

    let index = 0;
    products.forEach((product) => {
      html += buildProductCard(product, index);
      ++index;
    });
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.popupInfo("get product list error", JSON.stringify(e));
    return;
  }

  html+=`
  		
  		<form class="float-left">
		  <button class="btn btn-outline-info">
		  	<span>&#8592;</span>
		  </button>
		</form>
		<form class="float-right">
			<button class="btn btn-outline-info">
				<span>&#8594;</span>
			</button>
		</form>
	 
  `

  Element.mainContent.innerHTML = html;

  //event listeners

  const plusForms = document.getElementsByClassName("form-increase-qty");
  for (let i = 0; i < plusForms.length; i++) {
    plusForms[i].addEventListener("submit", (e) => {
      e.preventDefault();

      const p = products[e.target.index.value];
      cart.addItem(p);
      document.getElementById(`qty-${p.docId}`).innerHTML = p.qty;

      Element.shoppingcartCount.innerHTML = cart.getTotalQty();
    });
  }

  const minusForms = document.getElementsByClassName("form-decrease-qty");
  for (let i = 0; i < minusForms.length; i++) {
    minusForms[i].addEventListener("submit", (e) => {
      e.preventDefault();

      const p = products[e.target.index.value];
      cart.removeItem(p);
      document.getElementById(`qty-${p.docId}`).innerHTML =
        p.qty == null || p.qty == 0 ? "Add" : p.qty;

      Element.shoppingcartCount.innerHTML = cart.getTotalQty();
    });
  }

  const commentForms = document.getElementsByClassName("form-comment");
  for (let i = 0; i < commentForms.length; i++) {
    commentForms[i].addEventListener("submit", async (e) => {
      e.preventDefault();
      
	  
      await CommentPage.comment_page(e.target.commentId.value)
	 
     
    });

	const wishlistForm = document.getElementsByClassName("form-wishlist")
	for(let i = 0;i<wishlistForm.length;i++){
		wishlistForm[i].addEventListener("submit",async (e)=>{
			e.preventDefault()
			let p = products[e.target.index.value]
			wishlist.addItem(p)
			await FirebaseController.updateWishlist(Auth.currentUser.uid,wishlist);
		})
	}
  }

  

}


function buildProductCard(product, index) {
  return `
		
		<div class="card" style="width: 18rem; display: inline-block;">
			<img src="${product.imageURL}" height="400px" class="card-img-top">
			<div class="card-body">
		 	 <h5 class="card-title">${product.name}</h5>
		 	 <p class="card-text">
			 	${Util.currency(product.price)} <br> 
				 ${product.summary} 
			  </p>
		 	  <div class="container pt-3 bg-light ${
          Auth.currentUser ? "d-block" : "d-none"
        }">
				<form method="post" class="d-inline form-decrease-qty">
					<input type="hidden" name="index" value="${index}">
					<button class="btn btn-outline-danger" type="submit">&minus;</button>
				</form>
				<div id="qty-${
          product.docId
        }" class="container rounded text-center text-white bg-primary d-inline-block w-50"> 
					${product.qty == null || product.qty == 0 ? "Add" : product.qty}
				</div>
				<form method="post" class="d-inline form-increase-qty">
					<input type="hidden" name="index" value="${index}">
					<button class="btn btn-outline-danger" type="submit">&plus;</button>
				</form>
			  </div>
			  <div>
			 	<form class="form-comment float-left" method="post">
				 	<input type="hidden" name="commentId" value="${product.docId}">
					<button class="btn btn-outline-primary">Comment</button>
				</form> 
				</div>
				<div class="${Auth.currentUser ? "d-block" : "d-none"}">
				<form class="form-wishlist float-right" method="post">
					<input type="hidden" name="index" value="${index}">
					<input type="hidden" name="productId" value="${product.docId}">
					<button class="btn btn-outline-primary" type="submit">
						<img src="images/addtowish.jpg" width="30px" height="30px">
					</button>
				</form>
				</div>
			  </div>
			</div>
	  </div>
		
		`;
}
export function getShoppingCartFromLocalStorage() {
  const cartStr = window.localStorage.getItem(`cart-${Auth.currentUser.uid}`);

  cart = ShoppingCart.parse(cartStr);
  if (!cart || !cart.isValid() || Auth.currentUser.uid != cart.uid) {
    window.localStorage.removeItem(`cart-${Auth.currentUser.uid}`);
    cart = new ShoppingCart(Auth.currentUser.uid);
  }

  Element.shoppingcartCount.innerHTML = cart.getTotalQty();
}

export async function getWishlist(){
	wishlist = await FirebaseController.getWishlist(Auth.currentUser.uid)
}