/* =====================================
          Global Variables
   ===================================== */
   
var mapFilename = "";
var jukebox = new Jukebox();


var tileHeight=48; // Height of the isometric tile, minus what is below the surface.
var tileWidth=96; // Width of the isometric tile.
var tileGround=18; // Value of the isometric tile that is below the surface.
var tileHeightTotal = tileHeight + tileGround;  // Value of the height for the surface, plus the ground, so total height of the tile.

var gameName = "Isometric.js";
var versionNumber = "0.31";


// Add "onmouseover" and "onmouseout" events to every tile.
for (var i=0;i<tiles.length;i++) {
    tiles[i].onmouseover = tileOver;
    tiles[i].onmouseout = tileOut;
}


/* =====================================
                Classes
   ===================================== */

function Canvas(id) {
  // The drawing canvas for the viewport

  /*--------------------------Properties----------------------------------------
  id,         str     :   Canvas ID.
  element,    obj     :   Canvas Element.
  context,    obj     :   Canvas context.
  width,      int     :   Width of the Canvas.
  height,     int     :   Height of the Canvas.
  ----------------------------------------------------------------------------*/
	this.id = id;
	this.element = document.getElementById(id);
	this.context = this.element.getContext("2d");
	this.width = this.element.getAttribute("width");
	this.height = this.element.getAttribute("height");
	
  
  /*--------------------------Methods-------------------------------------------
  reset()             :   Resets the Canvas, clearing anything drawn on it.
  debug()             :   Displays an alert with the width of the Canvas.
  ----------------------------------------------------------------------------*/
  
	this.reset = function() {
		this.element.width = this.width;
	};
	
	this.debug = function() {
		window.alert(this.width);
	};
}


function Tile(xmlFile) {
  // Contains the information for each individual tile.

  /*--------------------------Properties----------------------------------------
  x,          int     :   Horizontal coordinate of the tile.
  y,          int     :   Vertical coordinate of the tile.
  type,       str     :   The type of tile this is, i.e. grass, water, etc.
  elevation,  int     :   The level this tile is displayed on.
  ----------------------------------------------------------------------------*/
	this.x = xmlFile.getElementsByTagName("x");
	this.y = xmlFile.getElementsByTagName("y");
	this.type = xmlFile.getElementsByTagName("type");
	this.elevation = xmlFile.getElementsByTagName("elevation");
  
	
  /*--------------------------Methods-------------------------------------------
  getX(arrayIndex)    :   Returns the X value of the specified tile.
  getY(arrayIndex)    :   Returns the Y value of the specified tile.
  getType(arrayIndex) :   Returns the tile type of the specified tile.
  ----------------------------------------------------------------------------*/ 
	this.getX = function(arrayIndex) {
		return parseInt(this.x[arrayIndex].childNodes[0].nodeValue, 10);
	};
	
	this.getY = function(arrayIndex) {
		return parseInt(this.y[arrayIndex].childNodes[0].nodeValue, 10);
	};
	
	this.getType = function(arrayIndex) {
		return this.type[arrayIndex].childNodes[0].nodeValue;
	};
}


function Map(xmlFile) {
  // Contains all the map information.

  /*--------------------------Properties----------------------------------------
  x,          int     :   The horizontal size of the map.
  y,          int     :   The vertical size of the map.
  ----------------------------------------------------------------------------*/
	this.x = xmlFile.getElementsByTagName("specsX");
	this.y = xmlFile.getElementsByTagName("specsY");
}


function Jukebox() {
  // Controls the music.

  /*--------------------------Properties----------------------------------------
  playing,    bool    :    Indicates if music is being played or not.
  ----------------------------------------------------------------------------*/
	this.playing = false;

	
	this._initJukebox = function() {
		xmlhttp = xmlInit();

		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				xmlDoc=xmlhttp.responseXML;

				var musicFilename = xmlDoc.getElementsByTagName("music")[0].childNodes[0].nodeValue;
				
				document.getElementById("music").innerHTML='<audio id="jukebox" src="music/' + musicFilename + '" preload="auto" loop>';
			}
		};
		
		
	};
		
	// Public Methods
	this.musicControl = function() {
		musicController = document.getElementById("musicController");
		
		if (this.playing) {
    	document.getElementById("jukebox").pause();
			musicController.value = "Play Music";
			this.playing = false;
		}
		else {
      document.getElementById("jukebox").play();
			//document.getElementById("music").innerHTML='<audio src="music/' + musicFilename + '" autoplay loop>';
			musicController.value = "Stop Music";
			this.playing = true;

		}
	};
	
	this.forceStop = function() {
		document.getElementById("jukebox").pause();
		document.getElementById("musicController").value = "Play Music";
		this.playing = false;
	};
}


// Global Functions

function initialize() {
	printVersion();
	renderMap('maps/map1.xml');
}

function xmlInit()
{
	if (window.XMLHttpRequest)
	{//Code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{//Code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
		
	xmlhttp.open("POST",mapFilename,true);
	xmlhttp.send();
	
	return xmlhttp;
}


function xmlRead(elementName, elementId)
// Reads the value of a specific element, and returns it.
{
	xmlhttp = xmlInit();

	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			xmlDoc=xmlhttp.responseXML;

			return xmlDoc.getElementsByTagName(elementName)[elementId].childNodes[0].nodeValue;
		}
	};
}

function renderMap(mapFile) {
	mapFilename = mapFile;
	xmlhttp=xmlInit();
	
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
		xmlDoc=xmlhttp.responseXML;
		var txt="";
	
		// Viewport Vars
		/*var drawCanvas = new Canvas("viewport");
		var context = drawCanvas.context;
		var tileImage = new Image();*/
		
		var currentMap = new Map(xmlDoc);
		var tileset = new Tile(xmlDoc);
		
		
		jukebox._initJukebox();
		
		for (i=0;i<tileset.type.length;i++)
			{
				pointerX = tileset.getX(i);
				pointerY = tileset.getY(i);
				
				tileRight = (tileWidth/2)*((pointerX*-1)+pointerY);
				tileTop = ((pointerX-2)+pointerY)*(tileHeight/2)
                  -parseInt((tileGround*parseInt
                  (tileset.elevation[i].childNodes[0].nodeValue,10)),10);
				tileType = tileset.type[i].childNodes[0].nodeValue;
				
				// Experimental Canvas Code
				/*tileImage.src = "../gfx/tiles/grass1.png";

				context.drawImage(tile, 0, 0);*/
								
				txt = txt + '<div id="'+tileType+', '+tileTop+','+tileRight+'" class="' 
              + tileType + ' tile" style="width: '+ tileWidth +'; height: '+ 
              tileHeightTotal  + '; position: absolute; top:' + tileTop + 
              'px; left:' + tileRight + 'px;z-index: '+ pointerY + ';"></div>';
				
				
				// Redraw for elevation
				for (z=-2;z<parseInt(tileset.elevation[i].childNodes[0].nodeValue,10);z++) { 
					
					tileTop = (((pointerX-2)+pointerY)*(tileHeight/2)-tileGround)-tileGround*z;
					//window.alert(pointerX+','+pointerY+'| Elevation: '+z+' Top: '+tileTop);
					
					txt = txt + '<div id="'+tileType+', '+tileTop+','+tileRight+
                '"  class="' + tileType + ' tile" style="width: '+ tileWidth +
                '; height: '+ tileHeightTotal  + '; position: absolute; top:' +
                tileTop + 'px; left:' + tileRight + 'px;z-index: '+ pointerY + 
                ';"></div>';
				}
        
        
				

			}
		
		document.getElementById("mapBox").innerHTML=txt;
		
		}
		
		jukebox.forceStop();
	};
}

function printVersion() {
	txt = gameName + " | ver. " + versionNumber;
	document.getElementById("versionInfo").innerHTML = txt;
}

function tileHover(event) {
	tileType = event.target.className;
	xCoord=event.target.style.top;
	yCoord=event.target.style.left;
	elevation=event.target.style.zIndex;
	txt = "Type: " + tileType + "<br />Coords: " + xCoord + "," + yCoord + "<br />Elevation: "+elevation;
	document.getElementById("debugInfo").innerHTML = txt;
	
	event.target.className += ' on'; 
}

function tileExit(event) {
	txt = "";
	document.getElementById("debugInfo").innerHTML = txt;
	
	event.target.className = event.target.className.replace(/ ?on$/,'');
}
