const functions = require("firebase-functions");

const admin = require("firebase-admin");

var serviceAccount = require("./account_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const Constant = require("./constant.js");
const { user } = require("firebase-functions/lib/providers/auth");


exports.isAdmin = functions.https.onCall(isAdmin)
async function isAdmin(email) {  
		if(Constant.adminEmails.includes(email))
		return {Boolean : true}
		else return {Boolean : false}
}

exports.admin_addProduct = functions.https.onCall(addProduct);
async function addProduct(data, context) {
  if (!isAdmin(context.auth.token.email)) {
    if (Constant.DEV) console.log("not admin", context.auth.token.email);
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only admin can invoke this function"
    );
  }
  try {
    admin.firestore().collection(Constant.collectionNames.PRODUCTS).add(data);
  } catch (e) {
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError("internal", "addProduct failed");
  }
}
exports.admin_deleteProduct = functions.https.onCall(deleteProduct);
async function deleteProduct(docId,context){

	if (!isAdmin(context.auth.token.email)) {
		if (Constant.DEV) console.log("not admin", context.auth.token.email);
		throw new functions.https.HttpsError(
		  "unauthenticated",
		  "Only admin can invoke this function"
		);
	  }
	  try {
		admin.firestore().collection(Constant.collectionNames.PRODUCTS).doc(docId).delete();
	  } catch (e) {
		if (Constant.DEV) console.log(e);
		throw new functions.https.HttpsError("internal", "deletion failed");
	  }
}
exports.admin_updateProduct = functions.https.onCall(updateProduct);
async function updateProduct(updateInfo,context){
	if (!isAdmin(context.auth.token.email)) {
		if (Constant.DEV) console.log("not admin", context.auth.token.email);
		throw new functions.https.HttpsError(
		  "unauthenticated",
		  "Only admin can invoke this function"
		);
	  }
	  try {
		admin.firestore().collection(Constant.collectionNames.PRODUCTS).doc(updateInfo.docId).update(updateInfo.data);
	  } catch (e) {
		if (Constant.DEV) console.log(e);
		throw new functions.https.HttpsError("internal", "update failure");
	  }



}


exports.admin_userList = functions.https.onCall(getUserList)
async function getUserList(data,context){
	if (!isAdmin(context.auth.token.email)) {
		if (Constant.DEV) console.log("not admin", context.auth.token.email);
		throw new functions.https.HttpsError(
		  "unauthenticated",
		  "Only admin can invoke this function"
		);
	}
	const users = []
	try{
		let userRecord = await admin.auth().listUsers(2)
		users.push(...userRecord.users)

		let userToken = userRecord.pageToken
		while(userToken){
			userRecord = await admin.auth().listUsers(2,userToken)
			users.push(...userRecord.users)
			userToken = userRecord.pageToken
			
		}
		return users
	}catch(e){
		if (Constant.DEV) console.log(e);
		throw new functions.https.HttpsError("internal", "user retrieval failure");
	}



}



exports.admin_updateUser = functions.https.onCall(updateUser);
async function updateUser(data,context){
	if (!isAdmin(context.auth.token.email)) {
		if (Constant.DEV) console.log("not admin", context.auth.token.email);
		throw new functions.https.HttpsError(
		  "unauthenticated",
		  "Only admin can invoke this function"
		);
	}
	
	try{
	const uid = data.uid
	const update = data.update

	await admin.auth().updateUser(uid,update);
	}catch(e){
		if (Constant.DEV) console.log(e);
		throw new functions.https.HttpsError("internal", "user update failure");
	}
}



async function deleteUsersData(uid){
	if (!isAdmin(context.auth.token.email)) {
		if (Constant.DEV) console.log("not admin", context.auth.token.email);
		throw new functions.https.HttpsError(
		  "unauthenticated",
		  "Only admin can invoke this function"
		);
	}
	try{
	await admin.firestore().collection(Constant.collectionNames.ACCOUNT_INFO).doc(uid).delete()
	let snapShot = await admin.firestore().collection(Constant.collectionNames.PURCHASE_HISTORY).where('uid','==', uid).get()
	snapShot.forEach(doc =>{
		admin.firestore().doc(doc.id).delete()
	})}catch(e){
		if (Constant.DEV) console.log(e);
		throw new functions.https.HttpsError("internal", "user data deletion failure");
	}
}



exports.admin_deleteUser = functions.https.onCall(deleteUser)
async function deleteUser(uid,context){
	if (!isAdmin(context.auth.token.email)) {
		if (Constant.DEV) console.log("not admin", context.auth.token.email);
		throw new functions.https.HttpsError(
		  "unauthenticated",
		  "Only admin can invoke this function"
		);
	}
	try{
	//await deleteUsersData(uid);
	await admin.auth().deleteUser(uid);
	}catch(e){
		if (Constant.DEV) console.log(e);
		throw new functions.https.HttpsError("internal", "user deletion failure");
	}
}


