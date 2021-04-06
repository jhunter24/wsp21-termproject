import * as FirebaseController from "./firebase_controller.js";
import * as Constant from "../model/constant.js";
import * as Util from "../viewpage/util.js";
import * as Element from "../viewpage/element.js";
import { Product } from "../model/product.js";

let imageFile2Upload;

export function addEventListeners() {
  Element.formEditImageFileButton.addEventListener("change", (e) => {
    imageFile2Upload = e.target.files[0];
    if (!imageFile2Upload) return;
    const reader = new FileReader();
    reader.onload = () => (Element.formEditImageTag.src = reader.result);
    reader.readAsDataURL(imageFile2Upload);
  });
  Element.formEditProduct.addEventListener("submit", async (e) => {
    e.preventDefault();

    const button = e.target.getElementsByTagName("button")[0];
    const label = Util.disableButton(button);

    const p = new Product({
      name: e.target.name.value,
      price: e.target.price.value,
      summary: e.target.summary.value,
    });
    p.docId = e.target.docId.value;
    const errorTags = document.getElementsByClassName("error-edit-product");
    for (let i = 0; i < errorTags.length; i++) errorTags[i].innerHTML = "";
    const errors = p.validate(true);
    if (errors) {
      if (errors.name)
        Element.formEditProductError.name.innerHTML = errors.name;
      if (errors.price)
        Element.formEditProductError.price.innerHTML = errors.price;
      if (errors.summary)
        Element.formEditProductError.summary.innerHTML = errors.summary;
      Util.enableButton(button, label);
      return;
    }

    try {
      if (imageFile2Upload) {
        const imageInfo = await FirebaseController.uploadImage(
          imageFile2Upload,
          e.target.imageName.value
        );
        p.imageURL = imageInfo.imageURL;
      }
      //update firestore
      await FirebaseController.updateProduct(p);

      //update web interface
      console.log(p.docId);
      const cardTag = document.getElementById("card-" + p.docId);
      if (imageFile2Upload) {
        cardTag.getElementsByTagName("img")[0].src = p.imageURL;
      }
      cardTag.getElementsByClassName("card-title")[0].innerHTML = p.name;
      cardTag.getElementsByClassName(
        "card-text"
      )[0].innerHTML = `${p.price}<br>${p.summary}`;
      Util.popupInfo(
        "Updated",
        `${p.name} is updated successfully`,
        "modal-edit-product"
      );
    } catch (e) {
      if (Constant.DEV) console.log(e);
      Util.popupInfo("Update Error", JSON.stringify(e), "modal-edit-product");
    }

    Util.enableButton(button, label);
  });
}

export async function editProduct(docId) {
  console.log("docId from arguments:" + docId);
  let product;
  try {
    product = await FirebaseController.getProductById(docId);
    if (!product) {
      Util.popupInfo("getProductById error", `No product found by id ${docId}`);
      return;
    }

    Element.formEditProduct.docId.value = product.docId;
    Element.formEditProduct.name.value = product.name;
    Element.formEditProduct.price.value = product.price;
    Element.formEditProduct.summary.value = product.summary;
    Element.formEditProduct.imageName.value = product.imageName;
    Element.formEditImageTag.src = product.imageURL;
    imageFile2Upload = null;
    $("#modal-edit-product").modal("show");
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.popupInfo(
      "getProductById error",
      JSON.stringify(e),
      JSON.stringify(e)
    );
  }
}

export async function deleteProduct(docId, imageName) {
  try {
    await FirebaseController.deleteProduct(docId, imageName);
    
	const card = document.getElementById(`card-${docId}`)
	card.remove()
	Util.popupInfo("Deleted", `${docId} has been successfully delete`);
  } catch (e) {
    if (Constant.DEV) console.log(e);
    Util.popupInfo("Error", JSON.stringify(e));
  }
}
