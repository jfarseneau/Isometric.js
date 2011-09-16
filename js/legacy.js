function RenderMap(mapFile)
{
	//xmlhttpInit
	if (window.XMLHttpRequest)
	{//Code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{//Code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
		xmlDoc=xmlhttp.responseXML;
		var txt="";
	
		specsX = xmlDoc.getElementsByTagName("specsX");
		specsY = xmlDoc.getElementsByTagName("specsY");
		specsMusic = xmlDoc.getElementsByTagName("music");

		tileX = xmlDoc.getElementsByTagName("x");
		tileY = xmlDoc.getElementsByTagName("y");
		tileType = xmlDoc.getElementsByTagName("type");
		tileElevation = xmlDoc.getElementsByTagName("elevation");
		
		tileHeight=141;
		tileWidth=282;
		tileGround=69;
		tileHeightA = tileHeight + tileGround;
	
		for (i=0;i<tileType.length;i++)
			{
				mapX = parseInt(tileX[i].childNodes[0].nodeValue);
				mapY = parseInt(tileY[i].childNodes[0].nodeValue);
				
				tileRight = (tileWidth/2)*((mapX*-1)+mapY);
				tileTop = ((mapX-2)+mapY)*(tileHeight/2)-(tileGround*parseInt(tileElevation[i].childNodes[0].nodeValue));
				
				//txt = txt + tileRight + "<br />";
				txt = txt + '<div class=' + tileType[i].childNodes[0].nodeValue + ' style="width: '+ tileWidth +'; height: '+ tileHeightA  + '; position: absolute; top:' + tileTop + 'px; left:' + tileRight + 'px;z-index: '+ mapY + ';">'+ tileRight + '/' + tileTop + '||x'+ mapX + 'y' + mapY +'('+tileType[i].childNodes[0].nodeValue+')</div>';
				
				
				if (tileY[i].childNodes[0].nodeValue == specsX[0].childNodes[0].nodeValue)
				{
				//	txt=txt + "<br />";
				}
			}
		
		document.getElementById("mapBox").innerHTML=txt;
		//document.getElementById("music").innerHTML='<audio src="music/' + specsMusic[0].childNodes[0].nodeValue + '" autoplay loop controls>';
		}
	}
	
	xmlhttp.open("POST",mapFile,true);
	xmlhttp.send();
}