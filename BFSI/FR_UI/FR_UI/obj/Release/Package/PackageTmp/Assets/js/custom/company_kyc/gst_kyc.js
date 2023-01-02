﻿function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function get_mime_type(base64String) {
    debugger;
    var strings = base64String.split(",");
    var extension = "";
    switch (strings[0].toLowerCase()) {//check image's extension
        case "data:image/jpeg;base64":
            extension = "jpeg";
            break;
        case "data:image/png;base64":
            extension = "png";
            break;
        case "data:image/jpg;base64":
            extension = "jpg";
            break;
        case "data:application/pdf;base64":
            extension = "pdf";
            break;
        default://should write cases for more images types
            extension = "others";
            break;
    }
    return extension;
}

function single_convertToBase64(event) {
    debugger;
    $("#process_err_msg").html("");
    //console.log($("#" + event.id + "").val().split(".").pop());
    //console.log(event.getAttribute("pan_name"));

    var selectedFile = document.getElementById("" + event.id + "").files;
    //Check File is not Empty
    if (selectedFile.length > 0) {
        // Select the very first file from list
        var fileToLoad = selectedFile[0];
        // FileReader function for read the file.
        var fileReader = new FileReader();
        var base64;
        // Onload of file read the file content
        fileReader.onload = function (fileLoadedEvent) {
            base64 = (fileLoadedEvent.target.result).split(",")[1];
           

            

            // Print data in console
            //console.log(base64);

            if ($("#" + event.id + "_base64").length == 1) {
                $("#" + event.id + "_base64").attr("href", base64);

            } else {
                $("#base64_content").append("<a id='" + event.id + "_base64' href='" + base64 + "' ></a>");
            }


            var get_file_type = get_mime_type(fileLoadedEvent.target.result);

            if (get_file_type == "jpeg" || get_file_type == "jpg" || get_file_type == "png" || get_file_type == "pdf") {
                var image_tag = '';

                if (get_file_type == "pdf") {
                    image_tag = '<iframe id="preview_img2" class="doc custom_img_border" src="' + fileLoadedEvent.target.result + '" frameborder="0" style="width:100%;" height="500px"></iframe>';

                }
                else {

                    image_tag = '<img src="' + fileLoadedEvent.target.result + '" alt="Preview" class="img custom_img_border" style="width: 100%;height: 354px;" id="preview_img2">';
                }
                $("#div_preview_content_file").html(image_tag);
            }
            else {
                $('#preview_img2').attr('src', '/assets/img/img12.jpg');
            }

            //console.log(base64);
        };
        // Convert data to base64
        fileReader.readAsDataURL(fileToLoad);

    }

}

$("#submit_btn_id").click(function () {
    debugger;
    $("#process_err_msg").html("");

    if ($("#document_file").val() == "") {
        $("#process_err_msg").html("Please select a file");
    }
    else {
        var obj = {};

        obj.document_file_base64 = $("#document_file_base64").attr("href");
        var dataObject = JSON.stringify(obj);
        var get_data = $('#submit_btn_id').attr('data-loading-text');
        $('#submit_btn_id').html(get_data);
        $('#submit_btn_id').attr("disabled", true);
        $.ajax({
            url: "/Ajax/GSTCustomForm/",
            type: "POST",
            data: { dataObject: dataObject },
            success: function (data) {
                console.log(data);
                var html = '';
                if (data.StatusCode == 200) {

                    var arr = [];
                    $.each($("input[name='format_type']:checked"), function () {
                        arr.push(parseInt($(this).val()));
                    });
                    console.log(arr);

                    var final = data.Result;
                    for (var i in final) {
                        console.log(final[i]);

                        if ($.inArray(final[i].FormatType, arr) > -1) {
                            console.log("in");
                            if (final[i].FormatType == 1) {
                                html += 'Pan card is in Page Number: ' + final[i].PanPageNumber+'<br/>';
                            }
                            if (final[i].FormatType == 2) {
                                html += 'Aadhar card is in Page Numbers: ' + final[i].AdharPageNumber + '<br/>';
                            }
                            if (final[i].FormatType == 3) {
                                html += 'Bank Statement is exist in Page Numbers: ' + final[i].BankPageNumber + '<br/>';
                            }
                            if (final[i].FormatType == 4) {
                                html += 'Visiting card is in Page Number: ' + final[i].VistingcardPageNumber + '<br/>';
                            }

                        }


                    }
                    

                    $('#initial_hide').show();
                    $('#extracted_data').html(html)
                    $('#submit_btn_id').html("Process");
                    $('#submit_btn_id').attr("disabled", false);

                }
                
   
            },
           
        });

    }




});




