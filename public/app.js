
import * as Routes from "./controller/routes.js"
//use cloud function emulator
if(window.location.host.includes("localhost") || window.location.host.includes("127.0.0.1")){
    firebase.functions().useFunctionsEmulator("http://localhost:5001")
}

window.onload = () =>{
    const path = window.location.pathname
	const href = window.location.href
    Routes.routing(path,href);
}

window.addEventListener('popstate', e =>{
    e.preventDefault()
    const pathname = e.target.location.pathname
	const href = e.target.location.href
    Routes.routing(pathname,href);
})



import * as Auth from "./controller/auth.js"
Auth.addEventListeners();
import * as HomePage from "./viewpage/home_page.js"
HomePage.addEventListeners();
import * as PurchasePage from "./viewpage/purchase_page.js"
PurchasePage.addEventListeners();
import * as ProfilePage from "./viewpage/profile_page.js"
ProfilePage.addEventListeners();
import * as ShoppingcartPage from "./viewpage/shoppingcart_page.js"
ShoppingcartPage.addEventListeners();
import * as AdminPage from "./viewpage/admin_page.js"
AdminPage.addEventListeners();
import * as AdminProductsPage from "./viewpage/admin_products_page.js"
AdminProductsPage.addEventListeners();
import * as Edit from "./controller/edit_product.js"
Edit.addEventListeners();
import * as Add from "./controller/add_product.js"
Add.addEventListeners();
import * as CommentAdd from "./controller/add_comment.js"
CommentAdd.addEventListeners()
import * as CommentEdit from "./controller/edit_comment.js"
CommentEdit.addEventListeners()
