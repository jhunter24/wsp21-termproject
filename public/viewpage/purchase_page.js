import * as Element from "./element.js"
import * as Auth from "../controller/auth.js"
import * as Routes from "../controller/routes.js"
import * as FirebaseController from "../controller/firebase_controller.js"
import * as Util from "./util.js"
import * as Constant from "../model/constant.js"

export function addEventListeners(){
    Element.menuButtonPurchase.addEventListener( 'click', async ()=>{
        history.pushState(null,null,Routes.routePathname.PURCHASES)
        purchase_page();
        }
    )
}

let carts

export async function purchase_page(){
    if(!Auth.currentUser){
        Element.mainContent.innerHTML=`<h1>Protected</h1>`
        return;
    }

	try{
		carts = await FirebaseController.getPurchaseHistroy(Auth.currentUser.uid)
		if(!carts || carts.length == 0){
			Element.mainContent.innerHTML= 'No Purchase History Found'
			return
		}
	}catch(e){
		if(Constant.DEV) console.log(e)
		Util.popupInfo('Purchase History Error',JSON.stringify(e))
		return
	}
	let html = `<h1>Purchase History</h1>`

	html += `
		<table class="table table-striped">
		<thead>
		<tbody>
	`
		for(let index = 0;index < carts.length;index++){
			html+= `
				<tr><td>
					<form class="purchase-history" method="post">
						<input type="hidden" name="index" value="${index}">
						<button class="btn btn-outline-secondary" type="submit">
							${new Date(carts[index].timestamp).toString()}
						</button> 
					</form>
				</td></tr>
			`
		}

		html+='</tbody></table>'

    Element.mainContent.innerHTML= html


	const historyForms = document.getElementsByClassName('purchase-history')
	for(let i = 0;i < historyForms.length;i++){
		historyForms[i].addEventListener('submit', e =>{
			e.preventDefault()
			const index = e.target.index.value
			Element.modalTransactionTitle.innerHTML = `Purchased at: ${new Date(carts[index].timestamp).toString()}`
			Element.modalTransactionBody.innerHTML = buildTransactionDetail(carts[index])

			$('#modal-transaction').modal('show')
		})
	}


}

function buildTransactionDetail(cart){
	let html = `
		<table class="table table-striped">
			<thead>
				<tr>
					<th scope="col">Image</th>
					<th scope="col">Name</th>
					<th scope="col">Price</th>
					<th scope="col">Qty</th>
					<th scope="col">Subtotal</th>
					<th scope="col" width="50%">Summary</th>
				</tr>
			</thead>
		<tbody>
	`
	cart.items.forEach(item =>{
		html+=`
			<tr>
				<td><img src="${item.imageURL}" width="150px"></td>
				<td>${item.name}</td>
				<td>${Util.currency(item.price)}</td>
				<td>${item.qty}</td>
				<td>${Util.currency(item.price * item.qty)}</td>
				<td>${item.summary}</td>
			</tr>
		`
	})

	html +=`</tbody></table>`
	html += `<div style="font-size: 150%;">Total: $${cart.getTotalPrice()}</div>`

	return html
}