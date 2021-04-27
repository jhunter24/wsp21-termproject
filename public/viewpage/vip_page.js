import * as Element from "./element.js"
import * as Routes from "../controller/routes.js"
import * as FirebaseController from "../controller/firebase_controller.js"
import * as Constant from "../model/constant.js"
import * as Auth from '../controller/auth.js'
import * as Util from "./util.js"
import { Product } from "../model/product.js"
import * as HomePage from "./home_page.js"


let accountInfo
let productList
let cart
export function addEventListeners(){
	Element.menuButtonVIP.addEventListener('click', async ()=>{
	
		history.pushState(null,null,Routes.routePathname.VIP)
		await vip_page();
		

	})	

}



export async function vip_page(){

	
	cart = HomePage.cart




	try{
		let html = ``
		accountInfo = await FirebaseController.getAccountInfo(Auth.currentUser.uid)
		if(accountInfo.vip){
			productList = await FirebaseController.getVipProducts()
			// already member
			html += `<h1>VIP Member Page!</h1>`
		
			let index = 0;
			productList.forEach(p=>{

				html += buildProductCard(p,index++)
			})







			Element.mainContent.innerHTML = html

			const plusForms = document.getElementsByClassName("form-vip-increase-qty");
  for (let i = 0; i < plusForms.length; i++) {
    plusForms[i].addEventListener("submit", (e) => {
      e.preventDefault();

      const p = productList[e.target.index.value];
      cart.addItem(p);
      document.getElementById(`qty-${p.docId}`).innerHTML = p.qty;

      Element.shoppingcartCount.innerHTML = cart.getTotalQty();
    });
  }

  const minusForms = document.getElementsByClassName("form-vip-decrease-qty");
  for (let i = 0; i < minusForms.length; i++) {
    minusForms[i].addEventListener("submit", (e) => {
      e.preventDefault();

      const p = productList[e.target.index.value];
      cart.removeItem(p);
      document.getElementById(`qty-${p.docId}`).innerHTML =
        p.qty == null || p.qty == 0 ? "Add" : p.qty;

      Element.shoppingcartCount.innerHTML = cart.getTotalQty();
    });
  }



		}else{
			let monthPrice = 12
			//not a member
			html+= `
				<h1>VIP Purchase Page</h1>
				<div class="col"></div>
				<div class="col">
				
						<h2>Become a VIP?</h2>
						<h2>Access to special VIP discounts</h2>
						<h2>Flat discount rate of 10%</h2>
						<h2>Membership cost ${Util.currency(monthPrice)} per month</h2>
					<form id="vip-form" method="post">
						<button class="btn btn-outline-success" id="vip-form-button">Become VIP!!</button>		
					</form>
				</div>
				<div class="col"></div>
			`
			Element.mainContent.innerHTML += html


			document.getElementById('vip-form').addEventListener('submit',async e=>{
				e.preventDefault()
				const update = {}
					update['vip'] = true
				await FirebaseController.updateAccountInfo(Auth.currentUser.uid, update)
				await vip_page()
			})

		}


	}catch(e){
		if(Constant.DEV)console.log(e)
		return
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
				<form method="post" class="d-inline form-vip-decrease-qty">
					<input type="hidden" name="index" value="${index}">
					<button class="btn btn-outline-danger" type="submit">&minus;</button>
				</form>
				<div id="qty-${
          product.docId
        }" class="container rounded text-center text-white bg-primary d-inline-block w-50"> 
					${product.qty == null || product.qty == 0 ? "Add" : product.qty}
				</div>
				<form method="post" class="d-inline form-vip-increase-qty">
					<input type="hidden" name="index" value="${index}">
					<button class="btn btn-outline-danger" type="submit">&plus;</button>
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