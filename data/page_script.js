
var temperature = Object();
    var storedsettings = Object();
    
    temperature.color = "#FF9329";
    temperature.alpha = 0.3;

    temperature.starthour = "01";
    temperature.startminute = "00";
    temperature.endhour = "01";
    temperature.endminute = "00";  
    temperature.timerenabled = false; 
    temperature.iscustom = false;


function saveFile(url) {
  var d = new Date();
  var filename = "Screenshot " + d.toLocaleString();
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function() {
    var a = document.createElement('a');
    a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
    a.download = filename; // Set the file name.
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    delete a;
  };
  xhr.open('GET', url);
  xhr.send();
}


self.port.on("local_storage", function(storage) {

		var storageFC;
        
		if(storage == null){
			storageFC = storage;
		}
		else{
			storageFC = JSON.parse(storage);
		}
        

		if(storageFC == null || jQuery.isEmptyObject(storageFC))
		{
			storedsettings = temperature;
		}
		else
		{
			storedsettings = storageFC;
		}

        temperature.color =  storedsettings.color;
        temperature.alpha = storedsettings.alpha;
        temperature.starthour =  storedsettings.starthour;
        temperature.startminute = storedsettings.startminute;
        temperature.endhour =  storedsettings.endhour;
        temperature.endminute = storedsettings.endminute;
        temperature.timerenabled = storedsettings.timerenabled;
        temperature.iscustom = storedsettings.iscustom;

        if(temperature.timerenabled === true){
            var currentDate = new Date();
            var currentHour = currentDate.getHours();
            var currentMinute = currentDate.getMinutes();
            var timerstart = new Date();
            var timerend = new Date();
            
            timerstart.setHours(temperature.starthour);
            timerstart.setMinutes(temperature.startminute);
            timerend.setHours(temperature.endhour);
            timerend.setMinutes(temperature.endminute);
            
            if(timerstart > timerend){
                if((currentDate >= timerstart && currentHour <= 24) || (currentHour >= 1 && currentDate <= timerend )){
                    if((currentDate >= timerstart && currentMinute <= 60) || (currentMinute >= 0 && currentDate <= timerend )){
                        applycolor();  
                    }
                }
            }else{
                if(currentDate >= timerstart && currentDate <= timerend){
                    applycolor();
                }
            }

        }else{
            applycolor();
        }

    function applycolor() {              
        if (temperature.color == "Off") {
            return;
        }
        if(document.getElementById("coverTemperature") !== null){
            document.getElementById("coverTemperature").remove();
        }

        var div = document.createElement('div');
        div.id = 'coverTemperature';
        div.style.zIndex = 2147483647;
        div.style.display = "block";
        div.style.width = "100%";
        div.style.height = "100%";
        div.style.pointerEvents = "none";
        div.style.position = "fixed";
        div.style.top = 0;
        div.style.left = 0;

        div.style["background-color"] = temperature.color;
        div.style.opacity = temperature.alpha;
    
        document.documentElement.appendChild(div);
    }

});



