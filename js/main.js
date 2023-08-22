$(document).ready(function(){

    //add button click
    $("#add").click(function(){
       /* * 
        * Business Rule
        * 1. Names and Values can contain only alpha-numeric characters.
        * 2. The equal-sign is used to delimit the pair
        * 3. spaces before and/or after the equal-sign may be entered by the end user (and should be ignored.) 
        * */

       var nameValueArray = $("#nameValueInput").val().split("=");
       if(nameValueArray.length != 2){ errorAlert("invalid input"); return; }
       var name = nameValueArray[0];
       var value = nameValueArray[1];
       if(!isAlphanumeric(name) || !isAlphanumeric(value)){ errorAlert("Name And Value must be in Alpha Numberic"); return; }

       //if valid input, add to list
       $('#nameValueList').append($('<option>', {
            name: name,
            value: value,
            text: $("#nameValueInput").val()
        }));
        //clear input
        $("#nameValueInput").val('');
    });

    //delete button click
    $("#delete").click(function(){
        $("#nameValueList :selected").remove();
    });

    //sort by name
    $("#sortByName").click(function(){
        sort("name");
    });

    //sort by value
    $("#sortByValue").click(function(){
        sort("value");
    });

    $("#saveXML").click(function(){
        var xml = '<?xml version="1.0" encoding="utf-8" ?>\n<xml>\n';
        $("#nameValueList > option").each(function() {
            xml += "<" + $(this).attr("name") + ">" + $(this).attr("value") +"</" + $(this).attr("name") + ">\n";
        });

        xml += "</xml>";

        const link = document.createElement("a");
        const file = new Blob([xml], { type: 'text/xml' });
        link.href = URL.createObjectURL(file);
        link.download = "NameValue.xml";
        link.click();
        URL.revokeObjectURL(link.href);
    });

    $("#loadXML").click(function(){
        $('#getFile').click();
    });

    $('#getFile').change(function() {

        var file = $(this).prop('files')[0];
        var reader = new FileReader();
        reader.onload = () => {
            var xml = $.parseXML(reader.result);
            $(xml).find("xml").children().each(function (i, e){
                $('#nameValueList').append($('<option>', {
                    name: e.nodeName,
                    value: e.innerHTML,
                    text: e.nodeName+"="+e.innerHTML
                }));
            });

        };
        reader.readAsText(file);
        $(this)[0].value = '';
    });

    function isAlphanumeric(str) {
        return /^[a-zA-Z0-9]+$/.test(str);
    }

    function errorAlert(str) {
        alert(str);
    }

    function sort(attr){
        var options = $("#nameValueList option");                    
        options.detach().sort(function(a,b) {              
            var at = $(a).attr(attr);
            var bt = $(b).attr(attr);         
            return (at > bt)?1:((at < bt)?-1:0);            
        });
        options.appendTo("#nameValueList");  
    }
});