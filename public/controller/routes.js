import * as HomePage from "../viewpage/home_page.js"
import * as PurchasePage from "../viewpage/purchase_page.js"
import * as ProfilePage from "../viewpage/profile_page.js"
import * as ShoppingCart  from "../viewpage/shoppingcart_page.js"
import * as AdminProductPage from "../viewpage/admin_products_page.js"
import * as AdminPage from "../viewpage/admin_page.js"
import * as ConfirmationPage from "../viewpage/confirmation_page.js"

export const routePathname = {
    HOME: '/',
    PURCHASES: '/purchase',
    PROFILE: '/profile',
	SHOPPINGCART: '/shoppingcart',
	ADMIN: '/adminpage',
	ADMINPRODUCTS: '/adminProductsPage',
	CONFIRMATION: '/confirmation'
}

export const routes = [
    {pathname: routePathname.HOME, page:HomePage.home_page},
    {pathname: routePathname.PURCHASES, page:PurchasePage.purchase_page},
    {pathname: routePathname.PROFILE, page:ProfilePage.profile_page},
	{pathname: routePathname.SHOPPINGCART, page:ShoppingCart.shoppingcart_page},
	{pathname: routePathname.ADMINPRODUCTS, page:AdminProductPage.admin_products_page},
	{pathname: routePathname.ADMIN,page:AdminPage.admin_page},
	{pathname: routePathname.CONFIRMATION, page: ConfirmationPage.confirmation_page}
]


export function routing(path){
	const route = routes.find( r=> r.pathname == path)
	if(route) route.page()
    else routes[0].page()
}