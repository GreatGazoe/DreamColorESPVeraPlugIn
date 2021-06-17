var SET_HUE_SID = "urn:ggfiplupro-com:serviceId:DreamColorESP1";
var SET_COLOR_SID = "urn:micasaverde-com:serviceId:Color1";
var SET_BRI_SID = "urn:upnp-org:serviceId:Dimming1";
var DreamColorESPDevice;
var localip;
var brightness;
var speed;
var color;
var Hue;
var EffectNum = 1;
var Saturation;
var RGBColor ;
var	green = "R0,G255,B0";
var	orange = "255,145,0";
var	yellow = "153,153,0";
var	lightblue = "115,253,255";
var	blue = "0,34,255";
var	cyan = "153,255,255";
var	red = "255,0,0";
var	pink = "255,0,225";
var	purple = "157,0,255";
var white = "255,255,255";

function DreamColorESPControls(deviceID) {
   DreamColorESPDevice = deviceID;
   var ip = api.getDeviceState(deviceID, SET_HUE_SID, "VeraLocalIp");
   localip = "http://" + ip + "/port_3480";
   var color = api.getDeviceState(deviceID, SET_HUE_SID, "ColorJS");
   var colorrgb = color.split(',');
   color = rgb2hex(colorrgb[0], colorrgb[1], colorrgb[2])
   brightness = api.getDeviceState(deviceID, SET_BRI_SID, "LoadLevelStatus");
   speed = api.getDeviceState(deviceID, SET_HUE_SID, "SpeedStatus");
   
   var html = '<style type="text/css">effecttext{font-size:5px;}</style>';
   html += '<h3 style="position:relative; top: 0px; left: 0px;">Color</h3>';
   html += '<div style="position:relative; top: 0px; left: 0px; height:40px; background-image: -webkit-linear-gradient(left, red, orange, yellow, green, cyan, blue, violet, red);" ><input class="slider" type="range" min="0" max="360" step="1" value="" style="position:relative; top:10px" id="rgbcolor" onchange="DreamColorESPCallAction(this.value, 0)"></input></div>';
   html += '<h3 style="position:relative; top: 0px; left: 0px;">Saturation</h3>';
   html += '<div id="saturation" style="position:relative; top: 0px; left: 0px; height:40px; background-image: -webkit-linear-gradient(left, cyan, white);" ><input  type="range" min="1" max="100" step="1" value="" style="position:relative; top:10px" id="rgbcolor" onchange="satslider(this.value, 0)"></div>';   
   html += '<h3 style="position:relative; top: 0px; left: 0px;">Brightness</h3>';
   html += '<div  style="position:relative; top:0px; left: 0px; height:40px; background-image: -webkit-linear-gradient(left, black, white);"><input type="range" min="1" max="255" value=""  id="brightness" onchange="setbrightness(this.value)" style="position:relative; top:10px"></div>';
   html += '<h3 style="position:relative; top: 0px; left: 0px;">Speed</h3>';
   html += '<div class="slider"><input type="range" min="1" max="100" value="50" id="Speed" style="direction:rtl;" onchange="setspeed(this.value)"></input></div>';
   html += '<h3 style="position:relative; top: 0px; left: 0px;">Effect Select</h3>';
   html += '<input id="effectselect" type="number" value="" style="position:relative; top: -10px; left: 0px; width:50px;" size="3">';
   html += '<button type="button" onclick="effectselect()" style="position:relative; top: -10px; left: 30px;" > Choose Effect</button>';
   html += '<p style="font-size:10px;">1. Custom Colors fullstrip			2. All Rainbow colors one by one			3. All Rainbow colors chasing			4. All Rainbow colors chasing dots			5. Custom Colors chasing dots			6. All Rainbow colors fade in/out			7. Random Colors fade in/out			8. LarsonScanner (K.I.T.T.)			9. StroboScoop</p>';
   html += '<h3 style="position:relative; top: 0px; left: 0px;">Modus</h3>';
   html += '<input type="radio" name="toggle" id="toggle" checked onchange="fullcolor()" > Full Color  </input>';
   html += '<input type="radio" name="toggle" id="toggle1" onchange="effectselect()" > Effect </>';
	html += '<h3 style="position:relative; top: -82px; left: 260px;">Reset</h3>';  
	html += '<button type="button" onclick="resetdevice()" style="position:relative; top: -82px; left: 260px;" > Reset</button>';
	html += '<h3 style="position:relative; top: 0px; left: 0px;">Pre-Defined Colors</h3>';
   html += '<button type="button" onclick="colorselect(red)" style="position:relative; top: 0px; left: 10px;" >  Red   </button>';
   html += '<button type="button" onclick="colorselect(orange)" style="position:relative; top: 0px; left: 20px;" > Orange </button>';
   html += '<button type="button" onclick="colorselect(yellow)" style="position:relative; top: 0px; left: 30px;" > Yellow </button>';
   html += '<button type="button" onclick="colorselect(lightblue)" style="position:relative; top: 0px; left: 40px;" >Li-Blue</button>';
   html += '<button type="button" onclick="colorselect(green)" style="position:relative; top: 0px; left: 50px;" > Green  </button>';
   html += '<button type="button" onclick="colorselect(cyan)" style="position:relative; top: 0px; left: 60px;" >  Cyan  </button>';
   html += '<button type="button" onclick="colorselect(blue)" style="position:relative; top: 0px; left: 70px;" >  Blue  </button>';
   html += '<button type="button" onclick="colorselect(purple)" style="position:relative; top: 0px; left: 80px;" > Purple </button>';
   html += '<button type="button" onclick="colorselect(pink)" style="position:relative; top: 0px; left: 90px;" >  Pink  </button>';
   html += '<button type="button" onclick="colorselect(white)" style="position:relative; top: 0px; left: 100px;" >  White  </button>';
   set_panel_html(html);
   document.getElementById("brightness").value = brightness;
   document.getElementById("Speed").value = speed;
   document.getElementById("rgbcolor").value = color;
}

function DreamColorESPCallAction(newhue, x) {
   var h = newhue;
    window.Hue = parseInt(h);
    var s = window.Saturation;
    if (s==null || s==undefined) {s=50;}
    var v = 100;
    var str =  hsvToRgb(h, s, v) + '';
    rgb = str.split(",");
	var r = rgb[0];
	var g = rgb[1];
	var b = rgb[2];
	var rgb = r + ","  + g + ","  + b; 
    var rgbvar = "R" + r + "," + "G" + g + "," + "B" + b;    
    var slidercolor = "-webkit-linear-gradient(left, white, rgba(" + str + ",1))";
	if (x==0){
		document.getElementById("saturation").style.backgroundImage = slidercolor;
	}
	window.RGBColor = rgb;
   var result = '';
   var q = {
      'id': 'lu_action',
      'output_format': 'xml',
      'DeviceNum': DreamColorESPDevice,
      'serviceId': SET_COLOR_SID,
      'action': 'SetColorRGB',
	  'newColorRGBTarget': rgbvar,
	  'timestamp': new Date().getTime()   //we need this to avoid IE caching of the AJAX get
   };
   new Ajax.Request (localip + '/data_request', {
      method: 'get',
      parameters: q,
      onSuccess: function (response) {
      },
      onFailure: function (response) {
      },
      onComplete: function (response) {
         result = response.responseText;
      }
   });
   return result;
   result = api.setDeviceState(deviceID, SET_HUE_SID, "ColorJS", rgb, 1);
}

function satslider(saturation) {
	var saturation1 = saturation;
	window.Saturation = parseInt(saturation1);
	var saturation2 = saturation1 + "%";
	var h = window.Hue;
	DreamColorESPCallAction(h, 1)
}

function setbrightness(newbri) {
   var result = '';
   var q = {
      'id': 'lu_action',
      'output_format': 'xml',
      'DeviceNum': DreamColorESPDevice,
      'serviceId': SET_BRI_SID,
      'action': 'SetLoadLevelTarget',
	  'newLoadlevelTarget': newbri,
	  'timestamp': new Date().getTime()   //we need this to avoid IE caching of the AJAX get
   };
   new Ajax.Request (localip + '/data_request', {
      method: 'get',
      parameters: q,
      onSuccess: function (response) {
      },
      onFailure: function (response) {
      },
      onComplete: function (response) {
         result = response.responseText;
      }
   });
   return result;
}

function setspeed(newspeed) {
   var result = '';
   var q = {
      'id': 'lu_action',
      'output_format': 'xml',
      'DeviceNum': DreamColorESPDevice,
      'serviceId': SET_HUE_SID,
      'action': 'SetSpeedTarget',
	  'newSpeedTarget': newspeed,
	  'timestamp': new Date().getTime()   //we need this to avoid IE caching of the AJAX get
   };
   new Ajax.Request (localip + '/data_request', {
      method: 'get',
      parameters: q,
      onSuccess: function (response) {
      },
      onFailure: function (response) {
      },
      onComplete: function (response) {
         result = response.responseText;
      }
   });
   return result;
}

function effectselect() {
	var neweffect = document.getElementById("effectselect").value;    
	if (neweffect== null || neweffect==undefined || neweffect== "1" || neweffect == 1) { 
		var neweffect = "1" ;
		var toggle = document.getElementById("toggle");
		toggle.checked = true;
	} else {
		var toggle = document.getElementById("toggle1");
		toggle.checked = true;
	}
	window.EffectNum = neweffect     
	var result = '';
	var q = {
      'id': 'lu_action',
      'output_format': 'xml',
      'DeviceNum': DreamColorESPDevice,
      'serviceId': SET_HUE_SID,
      'action': 'SetEffectSelect',
	  'newEffectSelect': neweffect,
	  'timestamp': new Date().getTime()   //we need this to avoid IE caching of the AJAX get
   };
   new Ajax.Request (localip + '/data_request', {
      method: 'get',
      parameters: q,
      onSuccess: function (response) {
      },
      onFailure: function (response) {
      },
      onComplete: function (response) {
         result = response.responseText;
      }
   });
   return result;
}

function fullcolor() {
 	window.EffectNum = "1"  
	//result = api.setDeviceState(deviceID, SET_HUE_SID, "EffectSelect", "1", 1);
	var toggle = document.getElementById("toggle");
	toggle.checked = true;
	var result = '';
   var q = {
      'id': 'lu_action',
      'output_format': 'xml',
      'DeviceNum': DreamColorESPDevice,
      'serviceId': SET_HUE_SID,
      'action': 'SetEffectSelect',
	  'newEffectSelect': "1",
	  'timestamp': new Date().getTime()   //we need this to avoid IE caching of the AJAX get
   };
   new Ajax.Request (localip + '/data_request', {
      method: 'get',
      parameters: q,
      onSuccess: function (response) {
      },
      onFailure: function (response) {
      },
      onComplete: function (response) {
         result = response.responseText;
      }
   });
   return result;
}

function resetdevice() {
 	var result = '';
   var q = {
      'id': 'lu_action',
      'output_format': 'xml',
      'DeviceNum': DreamColorESPDevice,
      'serviceId': SET_HUE_SID,
      'action': 'SetFileSelect',
	  'newFileSelect': "1",
	  'timestamp': new Date().getTime()   //we need this to avoid IE caching of the AJAX get
   };
   new Ajax.Request (localip + '/data_request', {
      method: 'get',
      parameters: q,
      onSuccess: function (response) {
      },
      onFailure: function (response) {
      },
      onComplete: function (response) {
         result = response.responseText;
      }
   });
   return result;
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

 function rgb2hex(red, green, blue) {
        var rgb = blue | (green << 8) | (red << 16);
        return '#' + (0x1000000 + rgb).toString(16).slice(1)
  }

function colorselect(color) {
	var newhue1 = color
	var result = '';

	
   var q = {
      'id': 'lu_action',
      'output_format': 'xml',
      'DeviceNum': DreamColorESPDevice,
      'serviceId': SET_COLOR_SID,
      'action': 'SetColorRGB',
	  'newColorRGBTarget': newhue1,
	  'timestamp': new Date().getTime()   //we need this to avoid IE caching of the AJAX get
   };
   new Ajax.Request (localip + '/data_request', {
      method: 'get',
      parameters: q,
      onSuccess: function (response) {
      },
      onFailure: function (response) {
      },
      onComplete: function (response) {
         result = response.responseText;
      }
   });
   return result;
}

function myFunction() {
  document.getElementById("myDropdown").style.display = "block";
}

window.onclick = function(event) {
	document.getElementById("myDropdown").style.display = "none";
}
	
function hsvToRgb(h, s, v) {
	var r, g, b;
    var i;
    var f, p, q, t;
     
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));
     
    s /= 100;
    v /= 100;
     
    if(s == 0) {
      r = g = b = v;
        return [
            Math.round(r * 255), 
            Math.round(g * 255), 
            Math.round(b * 255)
        ];
    }
     
    h /= 60; 
    i = Math.floor(h);
    f = h - i; 
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));
     
    switch(i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
     
        case 1:
            r = q;
            g = v;
            b = p;
            break;
     
        case 2:
            r = p;
            g = v;
            b = t;
            break;
     
        case 3:
            r = p;
            g = q;
            b = v;
            break;
     
        case 4:
            r = t;
            g = p;
            b = v;
            break;
     
        default: 
            r = v;
            g = p;
            b = q;
    }
     
    return [
        Math.round(r * 255), 
        Math.round(g * 255), 
        Math.round(b * 255)
    ];
}

