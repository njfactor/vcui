function begin()
{
   assignment();
   confirm();
   if( qty>0 && qty!=NaN )
  {
      ok(); 
	  
  }
  updateAllConstantsDisplay();
}
//end

function updateAllConstantsDisplay()
{
	$("#total_price").text(total_price);
	$("#total_items").text(cart_top);
}

//to assign the details from the Qrcode to the global variables;
function assignment()
{
  pdId=details[0];
  pdName=details[1];
  mallPrice=convert(details[2]);//price is parsed
  server_url=details[3];
}
//end


//if the user presses OK
function confirm()
{
   qty=prompt(pdName+"   "+pdId+"    "+"\nenter quantity:","1");
   if(qty!=null)//if non-empty
  {
     qty=convert(qty);//may or maynot be a number
  }
}
//end


//to check if the item scanned is already present in the cart
function ok()
{
   var x=check();
   if(x==0)//present
  {
      alert("This item is already present in your cart.Your item will be replaced.");
      //if(confirm("do you wish to replace the existing item?")==true)//( user presses OK)
      replace();
	  //else( user presses CANCEL)
	      //ignore
  }
   else//not present
  {
      alert("You have scanned a new item.");
      subTotal=calc_subtotal(qty,mallPrice);
	  create_object();
	  total_price+=subTotal;
	  
	  addEntry();
  }
}
//end



//Server request to get product details
function getDetails()
{
    alert('in get details');//to be removed
	event.preventDefault();

	var finurl= getQueryString(server_url,pdId);
	var jqxhr= $.get( finurl, function( data ) {
	//alert(data);

	alert('Server has sent the data');
	//$("#getResult").text(data.mallPrice+" "+ data.imgURL);
	//$("#dynimg").attr("src", data.imgURL);
	
	
	var i;
	for(i=0;i<cart_top;i++)
	{
	if((cart[i].pdId.localeCompare(data.pdId))==0)
	break;
	}
	total_price-=cart[i].subTotal;
	cart[i] = data;
	alert(data.mallPrice);
	data.qty=qty;
	data.subTotal=calc_subtotal(data.qty,data.mallPrice);
	$("#img" + cart[i].pdId).attr("src",data.imgURL);
	$("#qt__" + cart[i].pdId).attr("value",data.qty);
	$("#sTotal" + cart[i].pdId).text(data.subTotal);
	$("#mPrice" + cart[i].pdId).text(data.mallPrice);//to be commented
	total_price+=cart[i].subTotal;
	updateAllConstantsDisplay();
	},"json");

	
	//var pdImg=document.getElementById('img' + cart[i].pdId + '');
	
	
}
//end


//to create the query string
function getQueryString (url,pid)
{	
return  url+"?method=getProductDetails&pID="+pid;	
}
//end




//Constructor for product class
function product(pdName,pdId,mallPrice,qty)
{
	this.pdName = pdName;
	this.pdId = pdId;
	this.mallPrice = mallPrice;
	this.qty=qty;
    this.subTotal=subTotal;
	//this.remove_object=remove_object;	
}


//to remove the product object from the cart array
function remove_object(id)
{
	var i;
	
    for(i=0;i<cart_top;i++)
   {
        if((cart[i].pdId.localeCompare(id))==0)
        break;
   }
    
    total_price-=cart[i].subTotal;//update the total price 
	
	var temp_arr_start=cart.splice(0,i+1);
	temp_arr_start.pop();
	cart=temp_arr_start.concat(cart);
    
	cart_top-=1;//update the cart index
	removeFromDisplay(id);
	updateAllConstantsDisplay();
}
//end


//creates a product object and inserts into the cart array
function create_object()
{
    var tempprod=new product(pdName,pdId,mallPrice,qty);
    cart.push(tempprod);
    cart_top++;
}
//end


//when an existing item is scanned,replacement occurs
function replace()
{
    var i;
    for(i=0;i<cart_top;i++)
  {
        if((cart[i].pdId.localeCompare(pdId))==0)
        break;
  }
    subTotal=calc_subtotal(qty,cart[i].mallPrice);//calculate the subtotal for now
	cart[i].qty=qty;//replace the qty;
	total_price=total_price-(cart[i].subTotal);//decrement the existing item's subtotal
    cart[i].subTotal=subTotal;//update the subtotal;
	total_price=total_price+subTotal;//update the total price
		
	$("#qt__" + cart[i].pdId).attr("value",cart[i].qty);
	$("#sTotal" + cart[i].pdId).text(cart[i].subTotal);
	
	updateAllConstantsDisplay();
}
//end




//auxillary functions

//to parse string into integer
function convert(x)
{
   return parseInt(x);
}
//end


//to calculate the item's subtotal
function calc_subtotal(mallPrice,qty)
{
  return mallPrice*qty;
}
//end


//to check if the item is already present in the cart array
function check()
{
  var i;
  for(i=0;i<cart_top;i++)
 {
    if((cart[i].pdId.localeCompare(pdId))==0)
       return 0;
 }
  return 1;
}
//end




//to splice the information.....called after scanner
function splitter(info)
{
	details=info.split(",");
}
//end


//to add the product to the visible cart
 function addEntry()
 {
 
 alert('in add entry');
 var $ele=$('<div data-role="collapsible" data-collapsed="false" id="'+pdId+'"><h1>'+pdName+'<a href="#" class="ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext" onclick="remove_object(this.id)" id = "'+pdId+'" style="float: right;">Delete</a></h1><div class="ui-grid-b"><div class="ui-block-a"><span><img src="" height = "200px"/ id="img' + pdId + '"></span></div><div class="ui-block-b"><span> <strong>Name:'+pdName+'<br>Id:'+pdId+' </strong><br><strong>Price: <span  id="mPrice' + pdId + '">'+mallPrice+'</span> </strong></span></div><div class="ui-block-c"><strong>Quantity:</strong> <input type="text" name="quantity" onkeyup="changeQuantity(this.id)" value="'+qty+'" id="qt__' + pdId + '" ><br>  <strong>Subtotal: <span id="sTotal' + pdId + '">'+subTotal+'</span></strong> </div></div></div>').appendTo(document.getElementById('wrapper'));
 
 $ele.collapsible();
 }
//end 


function removeFromDisplay(id)
{
	$("#"+id).remove();
}

function changeQuantity(qtId)
{
	var actualId = qtId.split("__").pop();
	
	var i;
    for(i=0;i<cart_top;i++)
  {
        if((cart[i].pdId.localeCompare(actualId))==0)
        break;
  }
    subTotal=calc_subtotal(qty,cart[i].mallPrice);//calculate the subtotal for now
	cart[i].qty=qty;//replace the qty;
	total_price=total_price-(cart[i].subTotal);//decrement the existing item's subtotal
    cart[i].subTotal=subTotal;//update the subtotal;
	total_price=total_price+subTotal;//update the total price
		
	//$("#qt__" + cart[i].pdId).attr("value",cart[i].qty);
	$("#sTotal" + cart[i].pdId).text(cart[i].subTotal);
	
	updateAllConstantsDisplay();
}