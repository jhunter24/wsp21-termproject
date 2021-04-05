
import * as Routes from "./controller/routes.js"
//use cloud function emulator
if(window.location.host.includes("localhost") || window.location.host.includes("127.0.0.1")){
    firebase.functions().useFunctionsEmulator("http://localhost:5001")
}

window.onload = () =>{
    const path = window.location.pathname
    Routes.routing(path);
}

window.addEventListener('popstate', e =>{
    e.preventDefault()
    const pathname = e.target.location.pathname
    Routes.routing(pathname);
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