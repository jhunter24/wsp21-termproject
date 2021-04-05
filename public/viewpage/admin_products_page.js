import * as Element from "./element.js"


export function addEventListeners(){
	Element.menuButtonProducts.addEventListener('click',()=>{
		admin_products_page()
	})
}



export function admin_products_page(){
	Element.mainContent.innerHTML='<h1>Admin Products Page</h1>'
}