import * as Element from "./element.js"
import * as Routes from "../controller/routes.js"
import * as FirebaseController from "../controller/firebase_controller.js"
import * as Constant from "../model/constant.js"
import * as Auth from "../controller/auth.js"

let accountInfo
export function addEventListeners(){
	Element.menuButtonVIP.addEventListener('submit', async (e)=>{
		e.preventDefault()
		history.pushState(null,null,Routes.routePathname.VIP)
		await vip_page();
		

	})	

}



export async function vip_page(){

	Element.mainContent.innerHTML = "<h1>VIP Page!</h1>"
	let hmtl




	try{
		accountInfo = await FirebaseController.getAccountInfo(Auth.currentUser)
		if(accountInfo.vip){
			
		}else{
			hmtl+= `
				<div class="col"></div>
				<div class="col">
				
						<h2>Become a VIP?</h2>
						<h2>Access to special VIP discounts</h2>
						<h2>Flat discount rate of 10%</h2>
					<form id="vip-form" method="post">
						<button id="vip-form-button">Become VIP</button>		
					</form>
				</div>
				<div class="col"></div>
			`
			Element.mainContent.innerHTML += html
		}


	}catch(e){
		if(Constant.DEV)console.log(e)
	}

}


