import { Product } from "../model/product.js";
import * as Constant from "../model/constant.js";
import { ShoppingCart } from "../model/shoppingcart.js";
import { AccountInfo } from "../model/account_info.js";
import { Comment } from "../model/comment.js";
import { Wishlist } from "../model/wishlist.js";


const cf_isAdmin = firebase.functions().httpsCallable("isAdmin");
export async function isAdmin(email) {
  return await cf_isAdmin(email);
}

export async function signIn(email, password) {
  await firebase.auth().signInWithEmailAndPassword(email, password);
}

export async function signOut() {
  await firebase.auth().signOut();
}

export async function getProductList() {
  let products = [];

   const snapShot = await firebase
     .firestore()
     .collection(Constant.collectionName.PRODUCTS)
     .orderBy("name")
     .get();

   snapShot.forEach((doc) => {
     const p = new Product(doc.data());
     p.docId = doc.id;
     products.push(p);
  });

  return products;
}

export async function getProductListByPagination() {
	let products = [];
  
	 const ref = await firebase
	   .firestore()
	   .collection(Constant.collectionName.PRODUCTS)
	   .orderBy("name")
	   .get();
  
  //   snapShot.forEach((doc) => {
  //     const p = new Product(doc.data());
  //     p.docId = doc.id;
  //     products.push(p);
  //   });
	  let current = firebase.firestore().collection(Constant.collectionName.PRODUCTS).orderBy("name").limit(8)
	  let last = 0
	  while(last <= ref.docs.length && last != ref.docs.length){
		  
	  let snapShot = await current.get();
		  let query = []
		  snapShot.forEach(doc =>{
			  let p = new Product(doc.data())
			  p.docId = doc.id
			  query.push(p)
		  })
		  products.push(query)
		  last += 8
		  let currentLast = snapShot.docs[snapShot.docs.length-1]
		  current = await firebase.firestore().collection(Constant.collectionName.PRODUCTS).orderBy("name").startAfter(currentLast).limit(8)
		  
	  }
  
	return products;
  }


export async function checkOut(cart) {
  const data = cart.serialize(Date.now());
  await firebase
    .firestore()
    .collection(Constant.collectionName.PURCHASE_HISTORY)
    .add(data);
}

export async function getPurchaseHistroy(uid) {
  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionName.PURCHASE_HISTORY)
    .where("uid", "==", uid)
    .orderBy("timestamp", "desc")
    .get();
  const carts = [];
  snapShot.forEach((doc) => {
    const sc = ShoppingCart.deserialize(doc.data());
    carts.push(sc);
  });
  return carts;
}

export async function createUser(email, password) {
  await firebase.auth().createUserWithEmailAndPassword(email, password);
}

export async function getAccountInfo(uid) {
  const doc = await firebase
    .firestore()
    .collection(Constant.collectionName.ACCOUNT_INFO)
    .doc(uid)
    .get();

  if (doc.exists) {
	let account = new AccountInfo(doc.data())
	account.docId = doc.id
    return account
  } else {
    const defualtInfo = AccountInfo.instance();
    await firebase
      .firestore()
      .collection(Constant.collectionName.ACCOUNT_INFO)
      .doc(uid)
      .set(defualtInfo.serialize());

	  defualtInfo.docId = uid
    return defualtInfo;
  }
}

export async function updateAccountInfo(uid, updateInfo) {
  await firebase
    .firestore()
    .collection(Constant.collectionName.ACCOUNT_INFO)
    .doc(uid)
    .update(updateInfo);
}
export async function uploadProfilePhoto(photoFile, imageName) {
  const ref = firebase
    .storage()
    .ref()
    .child(Constant.storageFolderName.PROFILE_PHOTOS + imageName);
  const taskSnapShot = await ref.put(photoFile);
  const photoURL = await taskSnapShot.ref.getDownloadURL();

  return photoURL;
}

const cf_getUserList = firebase.functions().httpsCallable("admin_userList");
export async function getUserList() {
  const results = await cf_getUserList();

  return results.data;
}

const cf_updateUser = firebase.functions().httpsCallable("admin_updateUser");
export async function updateUser(uid, update) {
  await cf_updateUser({ uid, update });
}

const cf_deleteUser = firebase.functions().httpsCallable("admin_deleteUser");
export async function deleteUser(uid) {
  await cf_deleteUser(uid);
}

const cf_deleteProduct = firebase
  .functions()
  .httpsCallable("admin_deleteProduct");
export async function deleteProduct(docId, imageName) {
  await cf_deleteProduct(docId);
  const ref = firebase
    .storage()
    .ref()
    .child(Constant.storageFolderName.PRODUCT_IMAGES + imageName);
  await ref.delete();
}

const cf_deleteUserData = firebase
  .functions()
  .httpsCallable("admin_deleteUserData");
export async function deleteUserData(uid) {
  await cf_deleteUserData(uid);
  await firebase
    .firestore()
    .collection(Constant.storageFolderName.PROFILE_PHOTOS)
    .doc(uid)
    .delete();
}

const cf_getProductById = firebase
  .functions()
  .httpsCallable("admin_getProductById");
export async function getProductById(docId) {
  const results = await cf_getProductById(docId);

  if (results.data) {
    const product = new Product(results.data);

    product.docId = results.data.docId;
    return product;
  } else {
    return null;
  }
}

const cf_updateProduct = firebase
  .functions()
  .httpsCallable("admin_updateProduct");
export async function updateProduct(product) {
  const docId = product.docId;
  const data = product.serializeForUpdate();
  await cf_updateProduct({ docId, data });
}

export async function uploadImage(imageFile, imageName) {
  if (!imageName) {
    imageName = Date.now() + imageFile.name;
  }

  const ref = firebase
    .storage()
    .ref()
    .child(Constant.storageFolderName.PRODUCT_IMAGES + imageName);

  const taskSnapshot = await ref.put(imageFile);
  const imageURL = await taskSnapshot.ref.getDownloadURL();
  return { imageName, imageURL };
}

const cf_addProduct = firebase.functions().httpsCallable("admin_addProduct");
export async function addProduct(product) {
  await cf_addProduct(product.serialize());
}

export async function getComments(productId) {
  const snapShot = await firebase
    .firestore()
    .collection(Constant.collectionName.COMMENTS)
    .where("productId", "==", productId)
    .orderBy("timestamp", "desc")
    .get();
  let c = [];
  snapShot.forEach((doc) => {
    let comment = Comment.deserialize(doc.data())
    comment.docId = doc.id;
	
    c.push(comment);
  });

  return c;
}

export async function storeComment(comment) {
	const data = comment.serialize(Date.now())

	await firebase.firestore().collection(Constant.collectionName.COMMENTS).add(data);
}


export async function deleteComment(commentId){
	await firebase.firestore().collection(Constant.collectionName.COMMENTS).doc(commentId).delete()
}

export async function updateComment(comment){
	await firebase.firestore().collection(Constant.collectionName.COMMENTS).doc(comment.docId).update(comment.serializeForUpdate())
}

export async function getProductByIdUser(docId){
	const doc = await firebase.firestore().collection(Constant.collectionName.PRODUCTS).doc(docId).get()
		return new Product(doc.data())
	
}


export async function updateWishlist(uid,list){
	await firebase.firestore().collection(Constant.collectionName.WISHLIST).doc(uid).update(list.serializeForUpdate())
}
export async function getWishlist(uid){

	const doc = await firebase.firestore().collection(Constant.collectionName.WISHLIST).doc(uid).get()

	if(doc.exists){
		return new Wishlist(doc.data())
	}else{
		const defaultInfo = Wishlist.instance()
		
		await firebase.firestore()
		.collection(Constant.collectionName.WISHLIST)
		.doc(uid)
		.set(defaultInfo.serialize());

		return defaultInfo
	}



}

const cf_removeVip = firebase.functions().httpsCallable("admin_removeVip")
export async function removeVip(uid,accountInfo){
	const docId = uid
	const account = accountInfo.serializeForUpdate()
	await cf_removeVip({docId,account});
}



const cf_addVIPproduct = firebase.functions().httpsCallable("admin_addVipProduct")
export async function addToVip(product){
	let serializeProduct = product.serialize()
	let docId = product.docId
	await cf_addVIPproduct({docId,serializeProduct})
}

const cf_deleteVIPproduct = firebase.functions().httpsCallable("admin_deleteVipProduct")
export async function removeFromVip(docId){
	await cf_deleteVIPproduct(docId)
}

export async function getVipProducts(){
	let snapShot = await firebase.firestore().collection(Constant.collectionName.VIP_PRODUCTS).get()
	let pList = []
	snapShot.forEach(doc =>{
		let p = new Product(doc.data())
		p.docId = doc.id
		pList.push(p)	
	})


	return pList
}