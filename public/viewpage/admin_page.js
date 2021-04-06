import * as Element from "./element.js"
import * as FirebaseController from "../controller/firebase_controller.js"
import * as Routes from "../controller/routes.js"
import * as Util from "./util.js"
import * as Constant from "../model/constant.js"


export function addEventListeners(){
	Element.menuButtonAdmin.addEventListener('click' ,async ()=>{


		history.pushState(null, null, Routes.routePathname.ADMIN);
		let label = Util.disableButton(Element.menuButtonAdmin);
		await admin_page();

		Util.enableButton(Element.menuButtonAdmin,label)

	})
}

export async function admin_page(){

let html = '<h1>Admin Page</h1>'
let users;

try{
	users = await FirebaseController.getUserList()
	
	users.forEach(user =>{
		html += buildUserCard(user);
	})

}catch(e){
	if (Constant.DEV) console.log(e);
    Util.popupInfo("Error", JSON.stringify(e));
}


Element.mainContent.innerHTML = html;

const toggleForms = document.getElementsByClassName("form-toggle-user");
for (let i = 0; i < toggleForms.length; i++) {
  toggleForms[i].addEventListener("submit", async (e) => {
	e.preventDefault();
	const button = e.target.getElementsByTagName("button")[0];
	const label = Util.disableButton(button);
	const uid = e.target.uid.value;

	const update = {
	  disabled: e.target.disabled.value === "true" ? false : true,
	};

	try {
	  await FirebaseController.updateUser(uid, update);
	  e.target.disabled.value = `${update.disabled}`;
	  document.getElementById(`status-${uid}`).innerHTML = `${
		update.disabled ? "Disabled" : "Active"
	  }`;
	  Util.popupInfo("Status Toggled", `Disabled: ${update.disabled}`);
	} catch (e) {
	  if (Constant.DEV) console.log(e);
	  Util.popupInfo("Update User Error", JSON.stringify(e));
	}
	Util.enableButton(button, label);
  });
}


const deleteForms = document.getElementsByClassName("form-delete-user")
for(let i = 0;i < deleteForms.length;i++){
	deleteForms[i].addEventListener('submit', async e =>{
		
		e.preventDefault()
		const r = confirm('Are you sure you want to delete the user?')
	  
		if(!r) return

		const button = e.target.getElementsByTagName('button')[0]
		const label = Util.disableButton(button)
		const uid= e.target.uid.value

	  try{
		  await FirebaseController.deleteUserData(uid)
		  await FirebaseController.deleteUser(uid);

		  document.getElementById(`user-card-${uid}`).remove()
		  Util.popupInfo('Successfully deleted', `${uid} was successfully removed from the userbase`)
	  }catch(e){
		  Util.popupInfo('Error in deletion',JSON.stringify(e))
	  }
	  
	})
}


}







function buildUserCard(user){
	
	return `
  <div id="user-card-${user.uid}" class="card" style="width: 18rem; display: inline-block">
	<img src="${
    user.photoURL != null ? user.photoURL : "images/tempProfile.png"
  }" class="card-img-top" alt="...">
	<div class="card-body">
	  <h5 class="card-title">${user.email}</h5>
	  <p class="card-text">
		
		Status:<span id="status-${user.uid}"> ${
    user.disabled ? "Disabled" : "Active"
  }</span>
	  	</p>
		  <form class="form-toggle-user" method="post">
		 	<input type="hidden" name="uid" value="${user.uid}">
			 <input type="hidden" name="disabled" value="${user.disabled}">
			 <button class="btn btn-outline-primary float-left" type="submit">Toggle Active</button> 	
		  </form>
		  <form class="form-delete-user" method="post">
		  <input type="hidden" name="uid" value="${user.uid}">
  			<button class="btn btn-outline-danger float-right" type="submit">delete</button>
		  </form>
	</div>
  </div>
	`;

}