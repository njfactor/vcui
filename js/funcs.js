function begin()
{
   assignment();
   confirm();
   if( pd_Qty>0 && pd_Qty!=NaN )
  {
      ok(); 
	  addEntry();
  }
  

}


//Server request to get product details
function getDetails()
{
	$("#get").click(function(event) {
	event.preventDefault();

	var finurl= getQueryString(server_url,pd_Id);
	var jqxhr= $.get( finurl, function( data ) {
	//alert(data);

	alert('Server has sent the data');
	//$("#getResult").text(data.mallPrice+" "+ data.imgURL);
	//$("#dynimg").attr("src", data.imgURL);
	cart[cart_top - 1] = data;//to change usind product id later
	},"json");
	});

}

function getQueryString (url,pid)
{	return  url+"?method=getProductDetails&pID="+pid;	}
//end




//Constructor for product class
function product(pd_Name,pd_Id,pd_Price,pd_Qty)
{
	this.pd_Name = pd_Name;
	this.pd_Id = pd_Id;
	this.pd_Price = pd_Price;
	this.pd_Qty=pd_Qty;
    this.pd_subtotal=pd_subtotal;
	//this.remove_object=remove_object;	
}

function remove_object(id)
{
	var i;
    for(i=0;i<cart_top;i++)
   {
        if((cart[i].pd_Id.localeCompare(id))==0)
        break;
   }
    
	var index=i;
    total_price-=cart[i].pd_subtotal;//update the total price 
	
	var temp_arr_start=cart.splice(0,index+1);
	temp_arr_start.pop();
	cart=temp_arr_start.concat(cart);
    
	cart_top-=1;//update the cart index
}

	
//end



function create_object()
{
    var tempprod=new product(pd_Name,pd_Id,pd_Price,pd_Qty);
    cart.push(tempprod);
    cart_top++;
}


//to assign the details from the Qrcode to the global variables;
function assignment()
{
  pd_Id=details[0];
  pd_Name=details[1];
  pd_Price=convert(details[2]);//price is parsed
  server_url=details[3];
}





//if the user presses OK
function confirm()
{
   pd_Qty=prompt(pd_Name+"   "+pd_Id+"    "+"\nenter quantity:","1");
   if(pd_Qty!=null)//if non-empty
  {
     pd_Qty=convert(pd_Qty);
  }
  
}





function ok()
{
   var x=check();
   if(x==0)//present
  {
      alert("already present!!");
      //if(confirm("do you wish to replace the existing item?")==true)//( user presses OK)
      replace();
	  //else( user presses CANCEL)
	      //ignore
  }
   else//not present
  {
      alert("new item detected");
      pd_subtotal=calc_subtotal(pd_Qty,pd_Price);
	  create_object();
	  total_price+=pd_subtotal;
  }
}






function replace()
{
    var i;
    for(i=0;i<cart_top;i++)
  {
        if((cart[i].pd_Id.localeCompare(pd_Id))==0)
        break;
  }
    
	
	pd_subtotal=calc_subtotal(pd_Qty,pd_Price);//calculate the subtotal for now
	cart[i].pd_Qty=pd_Qty;//replace the pd_Qty;
	total_price=total_price-(cart[i].pd_subtotal);//decrement the existing item's subtotal
    cart[i].pd_subtotal=pd_subtotal;//update the subtotal;
	total_price=total_price+pd_subtotal;//update the total price
}





//auxillary functions

//to parse string into integer
function convert(x)
{
   return parseInt(x);
}




//to calculate the item's subtotal
function calc_subtotal(pd_Price,pd_Qty)
{
  return pd_Price*pd_Qty;
}



function check()
{
  var i;
  for(i=0;i<cart_top;i++)
 {
    if((cart[i].pd_Id.localeCompare(pd_Id))==0)
       return 0;
 }
  return 1;
}





//to splice the information.....called after scanner
function splitter(info)
{
	details=info.split(",");
}
//end


/*
function addEntry()
{
 	var table = document.getElementById('testtemp');
	var rows=table.getElementsByTagName('tr');
	var rowCount = (rows.length)/2;
	
	var row = table.insertRow(rowCount);
	row.id=pd_Id;
	
	
	var col= row.insertCell(0);
    
	var conDiv=document.createElement('div');
    conDiv.id='container';
	
	
	var innerTable=document.createElement('table');
	innerTable.id='mytable';
	
	var innerRow=innerTable.insertRow(0);
	// this innertable is to be appended later to the previous div conDiv
	
	var data0=innerRow.insertCell(0);
	var data1=innerRow.insertCell(1);
	var data2=innerRow.insertCell(2);
	
	//data0.innerHTML = "data0";
	//data1.innerHTML = "data1";
	//data2.innerHTML = "data2";
	
	data0.className='image';
		var img_1=document.createElement('img');
	    	img_1.setAttribute("height",'150px');
	        img_1.setAttribute("src",'shampoo.jpg');
	data0.appendChild(img_1);
	
	data1.className='nameid';
	data1.innerHTML = pd_Name+"</br>"+pd_Id+"</br>"+pd_Price;
	
	data2.className='sbttl';
		var box_1=document.createElement('input');
	        box_1.setAttribute("type",'image');
	        box_1.setAttribute("src",'button.jpg');
			box_1.setAttribute("id",'remove');
			box_1.setAttribute("onClick",'remove_object(this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id)');
			box_1.setAttribute("height",'40px');
	
		var box_2=document.createElement('input');
			box_2.setAttribute("type",'text');
			box_2.setAttribute("id",'quantity');
			box_2.name=pd_Name;
			box_2.setAttribute("value",'1');
			box_2.setAttribute("onkeydown",'alert("panda")');
	
	data2.appendChild(box_1);
	data2.appendChild(box_2);
	data2.innerHTML =pd_subtotal;
	
	conDiv.appendChild(innerTable);
	col.appendChild(conDiv);

 }
 */
 
 
 
 function addEntry()
 {
 alert('in add entry');
 /* var parent_div=document.getElementById('wrapper');
 
 var child_div=document.createElement('div');
 child_div.id=pd_Id;
 child_div.setAttribute("data-role",'collapsible');
 child_div.setAttribute("data-collapsed",'false');
 
 $('child_divdiv[data-role=collapsible]').collapsible({refresh:true});
 var header=document.createElement('p');
 header.innerHTML="para";
 
 child_div.appendChild(header);
 parent_div.appendChild(header); */
 
 }
 
 
 
 /*
 function change_qty()
 {
 alert('in changge_qty');
 // var data2=document.getElementByName(name).parentNode;
 
 // var i;
 // for(i=0;i<cart_top;i++)
 // {
 // if(cart[i].pd_Name.localeCompare(name)==0)
 // break;
 // }


 // var str_qty=document.getElementByName(name).value;
 // cart[i].pd_Qty=convert(str_qty); 
  
 // total_price-=cart[i].pd_subtotal;
 // cart[i].pd_subtotal=calc_subtotal(cart[i].pd_Qty,cart[i].pd_Price);
 // total_price+=cart[i].pd_subtotal;

 
 // data2.innerHTML=cart[i].pd_subtotal;
 
 
 }
 */