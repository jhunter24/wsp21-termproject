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

exports.admin_deleteVipProduct = functions.https.onCall(deleteVipProduct)
async function deleteVipProduct(docId,context){

	if (!isAdmin(context.auth.token.email)) {
		if (Constant.DEV) console.log("not admin", context.auth.token.email);
		throw new functions.https.HttpsError(
		  "unauthenticated",
		  "Only admin can invoke this function"
		);
	  }
	  try {
		admin.firestore().collection(Constant.collectionNames.VIP_PRODUCTS).doc(docId).delete();
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


exports.admin_deleteUserData = functions.https.onCall(deleteUsersData)
async function deleteUsersData(uid,context){
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
		admin.firestore().collection(Constant.collectionNames.PURCHASE_HISTORY).doc(doc.id).delete()
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
	
	await admin.auth().deleteUser(uid);
	}catch(e){
		if (Constant.DEV) console.log(e);
		throw new functions.https.HttpsError("internal", "user deletion failure");
	}
}

exports.admin_getProductById = functions.https.onCall(getProductById)
async function getProductById(docId, context) {
	if (!isAdmin(context.auth.token.email)) {
	  if (Constant.DEV) console.log("not admin", context.auth.token.email);
	  throw new functions.https.HttpsError(
		"unauthenticated",
		"Only admin can invoke this function"
	  );
	}
  
	try {
	  const doc = await admin
		.firestore()
		.collection(Constant.collectionNames.PRODUCTS)
		.doc(docId)
		.get();
  
	  if (doc.exists) {
		const { name, summary, price, imageName, imageURL } = doc.data();
  
		const p = { name, price, summary, imageName, imageURL };
  
		p.docId = doc.id;
  
		return p;
	  } else {
		return null;
	  }
	} catch (e) {
	  if (Constant.DEV) console.log(e);
	  throw new functions.https.HttpsError(
		"internal",
		"get product by id failed"
	  );
	}
  }
  exports.admin_getProductById = functions.https.onCall(getProductById)
  async function getProductById(docId, context) {
	if (!isAdmin(context.auth.token.email)) {
	  if (Constant.DEV) console.log("not admin", context.auth.token.email);
	  throw new functions.https.HttpsError(
		"unauthenticated",
		"Only admin can invoke this function"
	  );
	}
  
	try {
	  const doc = await admin
		.firestore()
		.collection(Constant.collectionNames.PRODUCTS)
		.doc(docId)
		.get();
  
	  if (doc.exists) {
		const { name, summary, price, imageName, imageURL } = doc.data();
  
		const p = { name, price, summary, imageName, imageURL };
  
		p.docId = doc.id;
  
		return p;
	  } else {
		return null;
	  }
	} catch (e) {
	  if (Constant.DEV) console.log(e);
	  throw new functions.https.HttpsError(
		"internal",
		"get product by id failed"
	  );
	}
  }

  exports.admin_updateProduct = functions.https.onCall(updateProduct);
async function updateProduct(productInfo, context) {
  //product info = {docId, productUpdate}

  if (!isAdmin(context.auth.token.email)) {
    if (Constant.DEV) console.log("not admin", context.auth.token.email);
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Only admin can invoke this function"
    );
  }

  try {
    await admin
      .firestore()
      .collection(Constant.collectionNames.PRODUCTS)
      .doc(productInfo.docId)
      .update(productInfo.data);
  } catch (e) {
    if (Constant.DEV) console.log(e);
    throw new functions.https.HttpsError("internal", "update product failed");
  }
}

exports.admin_addProduct = functions.https.onCall(addProduct)
async function addProduct(data, context) {
	if (!isAdmin(context.auth.token.email)) {
	  if (Constant.DEV) console.log("not admin", context.auth.token.email);
	  throw new functions.https.HttpsError(
		"unauthenticated",
		"Only admin can invoke this function"
	  );
	}
	//assuming data uses object
	try {
	  await admin
		.firestore()
		.collection(Constant.collectionNames.PRODUCTS)
		.add(data);
	} catch (e) {
	  if (Constant.DEV) console.log(e);
	  throw new functions.https.HttpsError("internal", "addProduct failed");
	}
  }

  exports.admin_addVipProduct = functions.https.onCall(addVipProduct)
async function addVipProduct(data, context) {
	if (!isAdmin(context.auth.token.email)) {
	  if (Constant.DEV) console.log("not admin", context.auth.token.email);
	  throw new functions.https.HttpsError(
		"unauthenticated",
		"Only admin can invoke this function"
	  );
	}
	//assuming data uses object
	try {
	  await admin
		.firestore()
		.collection(Constant.collectionNames.VIP_PRODUCTS)
		.doc(data.docId).set(data.serializeProduct);
	} catch (e) {
	  if (Constant.DEV) console.log(e);
	  throw new functions.https.HttpsError("internal", "add VIP Product failed");
	}
  }

  exports.admin_removeVip = functions.https.onCall(removeVip)
  async function removeVip(updateInfo,context){
	if (!isAdmin(context.auth.token.email)) {
		if (Constant.DEV) console.log("not admin", context.auth.token.email);
		throw new functions.https.HttpsError(
		  "unauthenticated",
		  "Only admin can invoke this function"
		);
	  }

	  try{
		 await admin.firestore().collection(Constant.collectionNames.ACCOUNT_INFO).doc(updateInfo.docId).update(updateInfo.account)	
		}catch(e){
		if (Constant.DEV) console.log(e);
		throw new functions.https.HttpsError("internal", "vip removal failed");
	  }
  }