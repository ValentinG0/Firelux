
function populateTime(){
    for(i=1; i<25; i++){
        hour = (i < 10) ? ("" + 0 + i): i;
        $("#timer_starttime_hour").append('<option value="' + hour +'">' + hour + '</option>');
        $("#timer_endtime_hour").append('<option value="' + hour +'">' + hour + '</option>');
    }
    for(i=0; i<61; i++){
        minute = (i < 10) ? ("" + 0 + i): i;
        $("#timer_starttime_minute").append('<option value="' + minute +'">' + minute + '</option>');
        $("#timer_endtime_minute").append('<option value="' + minute +'">' + minute + '</option>');
    }
}
function resetBorder(){
    $("span").each(function(){      
        $(this).css("border","none");
    });
    $("#white, #off").css({"border-color": "#00000", 
                    "border-width":"1px", 
                    "border-style":"solid"});
}

var temperature = Object();

// Restores select box state to saved value from SimpleStorage.
function restore_options(storage) {

    var storageFC;

    if(storage == null){
        temperature = storage;
    }
    else{
        storageFC = JSON.parse(storage);
    }
    if(storageFC != null && !jQuery.isEmptyObject(storageFC))
    {
        temperature = storageFC;
    }


    if(temperature == null){
        temperature = Object();
        temperature.color = "#FF9329";
        temperature.alpha = 0.3;
        temperature.starthour = "01";
        temperature.startminute = "00";
        temperature.endhour = "01";
        temperature.endminute = "00";  
        temperature.timerenabled = false; 
        temperature.iscustom = false;
    }

    $("#trans").val(temperature.alpha * 100);
    $("#intensity_value").text(Math.trunc(temperature.alpha * 100) + "%");

    if(temperature.iscustom === true){
        $("#custom").css({"border-color": "#999999", 
                        "border-width":"2px", 
                        "border-style":"solid"});
        $("#custom").css("background-color", temperature.color);
    }else{
        $("*[data-value='" + temperature.color + "']").css({"border-color": "#999999", 
                                                        "border-width":"2px", 
                                                        "border-style":"solid"});
    }

    // Set the time
    $("#timer_starttime_hour").val(temperature.starthour);
    $("#timer_endtime_hour").val(temperature.endhour);
    $("#timer_starttime_minute").val(temperature.startminute);
    $('#timer_endtime_minute').val(temperature.endminute); 

    if(temperature.timerenabled === true ){
        $('#timer_enabled').prop('checked', true);
        $("#timer_startend").show();
    }else{
        $('#timer_enabled').prop('checked', false);
        $("#timer_startend").hide();
    }
}

self.port.on("load_panel", function(storage) {  

    populateTime();
    restore_options(storage);
    
    $("span").each(function(){      
        $(this).on("click", function() {
            resetBorder();
            $(this).css({"border-color": "#999999", 
                         "border-width":"3px", 
                         "border-style":"solid"});
            temperature.color =  $(this).attr("data-value");
            color_changed();
        });
    });

    $("#slider").on("change", function(){ 
        temperature.alpha = $("#trans").val()/100; 
        opacity_changed(); 
        $("#intensity_value").text(Math.trunc(temperature.alpha * 100) + "%");
    });
    
    // Only display the time if the automatic checkbox is checked
    $("#timer_enabled").change(function() {
        if(this.checked) {
            $("#timer_startend").show();
            temperature.timerenabled = true;
        }else{
            $("#timer_startend").hide();
            temperature.timerenabled = false;
        }
    });

    // Set the time
    $("#timer_starttime_hour").on('change', function() { temperature.starthour = this.value; });
    $("#timer_endtime_hour").on('change', function() { temperature.endhour = this.value; });
    $("#timer_starttime_minute").on('change', function() { temperature.startminute = this.value; });
    $("#timer_endtime_minute").on('change', function() { temperature.endminute = this.value; });
        
    $('.color-box').colpick({
	colorScheme:'dark',
	layout:'rgbhex',
	color:'ff8800',
	onSubmit:function(hsb,hex,rgb,el) {
		$(el).css('background-color', '#'+hex);
		$(el).colpickHide();
                temperature.color = '#'+hex;
                temperature.iscustom = true;
                color_changed();
	}
    })
    .css('background-color', temperature.color);

});

document.getElementById("saveBtn").addEventListener("click", function() {
    self.port.emit("close_save_panel", JSON.stringify(temperature));
});

function color_changed() {
    self.port.emit("temp_update_color", JSON.stringify(temperature));
}
function opacity_changed() {
    self.port.emit("temp_update_color", JSON.stringify(temperature));
}


