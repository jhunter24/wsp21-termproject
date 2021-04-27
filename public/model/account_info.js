export class AccountInfo {
  constructor(data) {
    this.name = data.name;
    this.address = data.address;
    this.city = data.city;
    this.state = data.state;
    this.zip = data.zip;
    this.creditCardNo = data.creditCardNo;
    this.photoURL = data.photoURL;
	this.vip = data.vip
  }

  serialize() {
    return {
      name: this.name,
      address: this.address,
      city: this.city,
      state: this.state,
      zip: this.zip,
      creditCardNo: this.creditCardNo,
      photoURL: this.photoURL,
	  vip: this.vip,
    };
  }


  static instance(){
	  return new AccountInfo(
	{
	   name:''
	  ,address:''
	  ,city:''
	  ,state:''
	  ,zip: 0
	  ,creditCardNo: 0
	  ,photoURL:'images/tempProfile.png'
	  ,vip:false
	})
  }

  serializeForUpdate(){
	  let a = {}
	  if(this.vip != null) a.vip = this.vip
	  if(this.name)a.name = this.name
	  if(this.address) a.address = this.address
	  if(this.city) a.city = this.city
	  if(this.state) a.state = this.state
	  if(this.zip) a.zip = this.zip
	  if(this.creditCardNo) a.creditCardNo = this.creditCardNo
	  if(this.photoURL) a.photoURL = this.photoURL


	  return a
  }
}
