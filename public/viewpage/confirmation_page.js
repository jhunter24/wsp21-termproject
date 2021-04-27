import * as Element from "./element.js"
import * as Routes from "../controller/routes.js"
import * as HomePage from "./home_page.js"
import * as Util from "./util.js"
import * as FirebaseController from "../controller/firebase_controller.js"
import * as Auth from "../controller/auth.js"
import { ShoppingCart } from "../model/shoppingcart.js"






export async function confirmation_page(){
const confirmCart = HomePage.cart
let accountInfo = await FirebaseController.getAccountInfo(Auth.currentUser.uid)
history.pushState(null,null,Routes.routePathname.CONFIRMATION + "#" + confirmCart.uid)


let taxes = confirmCart.getTotalPrice() * .10;
let shipping = confirmCart.getTotalQty() * 1.50;


let html = `<div class="row"><h1>Purchase Confirmation</h1></div>

	<div class="row">
	
	
	<table class="table">
  <thead class="table-dark">
	<th scope="col">Image</th>
	<th scope="col">ProductName</th>
	<th scope="col">Unit Price</th>
	<th scope="col">Quantity</th>
	<th scope="col">Total</th>
  </thead>
  <tbody>
   
 
`
confirmCart.items.forEach(item =>{
	html += buildRow(item)
})

html += ` 
</tbody>
	</table>
		</div>`

let price = confirmCart.getTotalPrice()
if(Auth.accountInfo.vip){
	price *= .9
}
let orderTotal = shipping + taxes + price
if(accountInfo.name != "" && accountInfo.address != "")
html+= `<div class="row" style="font-size: 150%; font-weight: bold;">
	<div class="col">
		<p><span>Ship to: </span> <br>
		<span>${accountInfo.name}</span><br>
		<span> ${accountInfo.address}</span><br>
		<span>  ${accountInfo.city}, ${accountInfo.state}</span><br>
		<span>	${accountInfo.zip}</span>
		</p>
	</div>
	<div class="col" style="font-size: 150%; font-weight: bold;">
		<table>
			<tbody>
				<tr>
					<td width="400px">Item Total:</td>
					<td style="">${Util.currency(price)}</td>
				</tr>
				<tr>
					<td>Estimated Shipping:</td>
					<td>${Util.currency(confirmCart.getTotalQty() * 1.50)}</td>
				</tr>
				<tr>
					<td>Estimated Taxes:</td>
					<td>${Util.currency(price * .10)}</td>
				</tr>
				<tr>
					<td>Order Total:</td>
					<td>${Util.currency(orderTotal)}</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>`
else{
	html+='<h2>Shipping Information Not Found</h2>'
}

html += ` <div class="row">
	<form  method="post" id="form-confirm-purchase" class="float-left">
		<button id="button-confirmation-purchase" class="btn btn-outline-primary" type="submit">Confirm Purchase</button>
	</form>
	<form  method="post" id="form-cancel-purchase" method="post" class="float-right">
		<button id="button-cancel-purchase" class="btn btn-outline-danger" type="submit">Cancel</button>
	</form>
</div>`


Element.mainContent.innerHTML = html


document.getElementById("form-confirm-purchase").addEventListener('submit', async (e)=>{
	e.preventDefault()
	let button = document.getElementById("button-confirmation-purchase")
	let label = Util.disableButton(button)

try{


	
	await FirebaseController.checkOut(HomePage.cart)
	Util.popupInfo('Success','Checkout complete')
	window.localStorage.removeItem(`cart-${Auth.currentUser.uid}`)
	HomePage.cart.empty()


	Element.shoppingcartCount.innerHTML ='0'
	history.pushState(null,null,Routes.routePathname.HOME)
	await HomePage.home_page()
	Util.enableButton(button,label)
}catch(e){
	Util.popupInfo("Error",JSON.stringify(e))
}

})	

document.getElementById("form-cancel-purchase").addEventListener('submit', async (e)=>{
	e.preventDefault()
	Util.popupInfo("Purchase Canceled","Purchase was successfuly canceled, nothing was charged");
	history.pushState(null,null,Routes.routePathname.HOME)
	await HomePage.home_page()
})


}

function buildRow(item){
	return `
		<tr>
			<td><img src="${item.imageURL}" width="300px" height="300px"></td>
			<td>${item.name}</td>
			<td>${Util.currency(item.price)}/Item</td>
			<td>${item.qty}</td>
			<td>${Util.currency(item.qty * item.price)}</td>
		</tr>
	
	`


}

