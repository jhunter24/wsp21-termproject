import * as Element from "./element.js"
import * as Auth from "../controller/auth.js"
import * as Routes from "../controller/routes.js"
import * as FirebaseController from "../controller/firebase_controller.js"
import * as Util from "./util.js"
import * as Constant from "../model/constant.js"


export function addEventListeners(){
    Element.menuButtonProfile.addEventListener( 'click', async ()=>{
        history.pushState(null,null,Routes.routePathname.PROFILE)   
        const label = Util.disableButton(Element.menuButtonProfile)
		await profile_page();
		Util.enableButton(Element.menuButtonProfile,label);
        }
    )
}


export async function profile_page(){

    if(!Auth.currentUser){
        Element.mainContent.innerHTML= `<h1>Protected</h1>`
        return
    }
	let html = `<h1>Profile</h1>`


	let accountInfo
	try{
		accountInfo = await FirebaseController.getAccountInfo(Auth.currentUser.uid)
	}catch(e){
		Util.popupInfo("Account Retrieval Error",JSON.stringify(e))
	}

	html += `
		<div class="alert alert-primary">
			Email: ${Auth.currentUser.email} (cannot change)
		</div>
		<form id="profile-name" class="form-profile-update" method="post">
				<table class="table table-sm">
					<tr>
						<td width="15%">Name: </td>
						<td width="60%"><input type="text" name="name" value="${accountInfo.name}" 
							placeholder="firstname lastname" disabled required pattern="^[A-Za-z][A-Za-z|'|-| ]+">
						</td>
						<td>${actionButtons()}</td>
					</tr>
				</table>
			
		</form>
		<form id="profile-address" class="form-profile-update" method="post">
				<table class="table table-sm">
					<tr>
						<td width="15%">Address: </td>
						<td width="60%"><input type="text" name="address" value="${accountInfo.address}" 
							placeholder="address" disabled required minlength="2">
						</td>
						<td>${actionButtons()}</td>
					</tr>
				</table>
			
		</form>
		<form id="profile-city" class="form-profile-update" method="post">
				<table class="table table-sm">
					<tr>
						<td width="15%">City: </td>
						<td width="60%"><input type="text" name="city" value="${accountInfo.city}" 
							placeholder="city" disabled required minlength="2">
						</td>
						<td>${actionButtons()}</td>
					</tr>
				</table>
			
		</form>
		<form id="profile-state" class="form-profile-update" method="post">
				<table class="table table-sm">
					<tr>
						<td width="15%">State: </td>
						<td width="60%"><input type="text" name="state" value="${accountInfo.state}" 
							placeholder="state" disabled required pattern="[A-Z]+" minlength="2" maxlength="2">
						</td>
						<td>${actionButtons()}</td>
					</tr>
				</table>
			
		</form>
		<form id="profile-zip" class="form-profile-update" method="post">
				<table class="table table-sm">
					<tr>
						<td width="15%">Zip: </td>
						<td width="60%"><input type="number" name="zip" value="${accountInfo.zip}" 
							placeholder="5 digit zipcode" disabled required min="10000" max="99999">
						</td>
						<td>${actionButtons()}</td>
					</tr>
				</table>
			
		</form>
		<form id="profile-creditCardNo" class="form-profile-update" method="post">
				<table class="table table-sm">
					<tr>
						<td width="15%">Credit Card: </td>
						<td width="60%"><input type="text" name="creditCardNo" value="${accountInfo.creditCardNo}" 
							placeholder="16 digit card number" disabled required pattern="[0-9]+" minlength="16" maxlength="16">
						</td>
						<td>${actionButtons()}</td>
					</tr>
				</table>

		</form>
		<table>
			<tr>
				<td>
					<input type="file" id="profile-photo-button" value="upload">
				</td>
				<td>
					<img id="profile-photo-tag" class="rounded-circle" width="250px" src="${accountInfo.photoURL}">
				</td>
				<td>
					<button id="profile-photo-update-button" class="btn btn-outline-danger">Update Photo</button>
				</td>
			</tr>
		</table>
	`
    Element.mainContent.innerHTML = html
	let photoProfile
	const updatePhotoButton = document.getElementById("profile-photo-update-button")
	updatePhotoButton.addEventListener("click", async () =>{
			if(!photoProfile) {
				Util.popupInfo("No photo selected",'Choose a profile picture')
				return
			}
			const label = Util.disableButton(updatePhotoButton)
			try{
				const photoURL = await FirebaseController.uploadProfilePhoto(photoProfile,Auth.currentUser.uid)
				await FirebaseController.updateAccountInfo(Auth.currentUser.uid,{photoURL})
				setProfileIcon(photoURL)
				Util.popupInfo("Success","Profile Photo Updated")
			}catch(e){
				if(Constant.DEV) console.log(e)
				Util.popupInfo("Error in update", JSON.stringify(e))
			}
			Util.enableButton(updatePhotoButton,label)
	})

	document.getElementById("profile-photo-button").addEventListener("change", e =>{
		photoProfile = e.target.files[0]
		if(!photoProfile) return
		const reader = new FileReader()
		reader.onload = ()=> document.getElementById('profile-photo-tag').src = reader.result
		reader.readAsDataURL(photoProfile)


	})
	
	const forms = document.getElementsByClassName("form-profile-update")

	for(let i = 0;i < forms.length;i++){
		forms[i].addEventListener("submit", async e =>{
			e.preventDefault()
			
			//const buttonLabel = e.submitter.innerHTML 
			const buttonLabel = e.target.submitter
			const buttons = e.target.getElementsByTagName('button')
			const inputTag = e.target.getElementsByTagName('input')[0]
			const key = inputTag.name
			const value = inputTag.value
		
			if(buttonLabel == 'Edit'){
				buttons[0].style.display = 'none'
				buttons[1].style.display = 'inline-block'
				buttons[2].style.display = 'inline-block'
				inputTag.disabled = false
			}else if (buttonLabel == 'Update'){
				//update account info
				try{
					const update = {}
					update[key] = value
					await FirebaseController.updateAccountInfo(Auth.currentUser.uid,update)
					accountInfo[key] = value
				}catch(e){
					if(Constant.DEV) console.log(e)
					Util.popupInfo(`Update Error: ${key}`,JSON.stringify(e))
				}
				buttons[0].style.display = 'block'
				buttons[1].style.display = 'none'
				buttons[2].style.display = 'none'
				inputTag.disabled = true
			}else {
				//cancel
				buttons[0].style.display = 'block'
				buttons[1].style.display = 'none'
				buttons[2].style.display = 'none'
				inputTag.value = accountInfo[key]
				inputTag.disabled = true
			}
		})
	}


}
function actionButtons(){
	return `
		<button onclick="this.form.submitter='Edit'" type="submit" class="btn btn-outline-primary">Edit</button>
		<button onclick="this.form.submitter='Update'" type="submit" class="btn btn-outline-danger" style="display: none;">Update</button>
		<button onclick="this.form.submitter='Cancel'" type="submit" class="btn btn-outline-secondary" style="display: none;" formnovalidate="true">Cancel</button>
	`
}

export function setProfileIcon(photoURL){
		Element.menuButtonProfile.innerHTML = `<img src="${photoURL}" class="rounded-circle" height="30px">`
}