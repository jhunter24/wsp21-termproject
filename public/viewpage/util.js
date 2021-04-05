import * as Element from "./element.js"


export function popupInfo(title,body,closeModal){

if(closeModal) $('#'+closeModal).modal('hide')


Element.popupInfoBody.innerHTML = body;
Element.popupInfoTitle.innerHTML = title;
$('#modal-popup-info').modal("show")

}


export function disableButton(btn){
	btn.disabled = true
	const label = btn.innerHTML
	btn.innerHTML ='Wait..'
	return label
}

export function enableButton(btn,label){
	if(label) btn.innerHTML = label
	btn.disabled = false
}

export function currency(money){
	return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(money)
}