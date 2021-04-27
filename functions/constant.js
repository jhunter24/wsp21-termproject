const { testLab } = require("firebase-functions");

exports.DEV = true;

exports.collectionNames = { 
PRODUCTS: 'products',
PURCHASE_HISTORY: 'purchase_history',
ACCOUNT_INFO: 'account_info',
VIP_PRODUCTS: 'vip_products'
};

exports.adminEmails = [
	'admin@test.com',
	'super@test.com'
]

