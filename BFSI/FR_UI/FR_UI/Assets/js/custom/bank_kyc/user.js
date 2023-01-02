function CheckBoxToRadio(selectorOfCheckBox, v1_id, v2_id) {
    $(selectorOfCheckBox).each(function () {
        $(this).change(function () {
            debugger;
            var isCheckedThis = $(this).prop('checked');
            var this_value = $(this).val();

            if (this_value == 0) {


                $('#' + v2_id).removeAttr('readonly', false);
            }
            else {
                $('#' + v2_id).attr('readonly', true);
            }
            $(selectorOfCheckBox).prop('checked', false);

            if (isCheckedThis === true) {

                $(this).prop('checked', true);
            }
            else {
                $('#' + v2_id).attr('readonly', true);
            }

            if (this_value == 1) {
                var v1_value = $('#' + v1_id).val();
                $('#' + v2_id).val(v1_value);
            }
        });
    });
}
CheckBoxToRadio(".checkbox-wrapper0 .bank_name_check", "v1_bank_name", "v2_bank_name");
CheckBoxToRadio(".checkbox-wrapper1 .payee_name_check", "v1_payee_name", "v2_payee_name");
CheckBoxToRadio(".checkbox-wrapper2 .cheque_no_check", "v1_cheque_no", "v2_cheque_no");
CheckBoxToRadio(".checkbox-wrapper3 .cheque_date_check", "v1_cheque_date", "v2_cheque_date");
CheckBoxToRadio(".checkbox-wrapper4 .amount_in_words_check", "v1_amount_in_words", "v2_amount_in_words");
CheckBoxToRadio(".checkbox-wrapper5 .amount_in_digits_check", "v1_amount_in_digits", "v2_amount_in_digits");
CheckBoxToRadio(".checkbox-wrapper6 .account_no_check", "v2_account_no", "v2_account_no");
CheckBoxToRadio(".checkbox-wrapper7 .ifsc_code_check", "v1_ifsc_code", "v2_ifsc_code");
CheckBoxToRadio(".checkbox-wrapper8 .payername_code_check", "v1_payername", "v2_payername");
CheckBoxToRadio(".checkbox-wrapper9 .amountfieldmatch_check", "v1_amountfieldmatch", "v2_amountfieldmatch");
CheckBoxToRadio(".checkbox-wrapper10 .validdate_check", "v1_validdate", "v2_validdate");
CheckBoxToRadio(".checkbox-wrapper11 .allfieldextracted_check", "v1_allfieldextracted", "v2_allfieldextracted");
CheckBoxToRadio(".checkbox-wrapper12 .ispayeenamevalid_check", "v1_ispayeenamevalid", "v2_ispayeenamevalid");





$('#insurance_section_div').hide();

$('#security_msg').hide();

$('#refresh_button').hide();

$(function () {
    $(":file").change(function () {
       document.getElementById("insurance_section_div").style.display = "none";
        //if (this.files && this.files[0]) {
        //    var reader = new FileReader();
        //    reader.onload = imageIsLoaded;
        //    reader.readAsDataURL(this.files[0]);
        //}



        var selectedFile = this.files;
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
                var get_file_type = get_mime_type(fileLoadedEvent.target.result);

                if (get_file_type == "jpeg" || get_file_type == "jpg" || get_file_type == "png" || get_file_type == "pdf") {
                    var image_tag = '';
                    
                    if (get_file_type == "pdf") {
                        image_tag = '<iframe id="preview_img2" class="doc" src="' + fileLoadedEvent.target.result + '" frameborder="0" style="width:100%;" height="500px"></iframe>';
                        
                    }
                    else {
                        
                        image_tag = '<img src="' + fileLoadedEvent.target.result + '" alt="Preview" class="img" style="width: 100%;" id="preview_img2">';
                    }
                    $("#div_preview_content_file").html('<div id="preview_img" style="display:none;" src=' + base64 + '></div>' + image_tag);
                    $('#file_err_msg').html("");
                    $('#process_error_msg').html("");                    
                    $('#Submit_err_msg').html("");
                }
                else {
                    
                    $('#preview_img2').attr('src', '/TATAAIGassets/img/preview.png');
                    $('#file_err_msg').html("Please upload a valid file");
                    $('#file_err_msg').css('color', 'red');
                    $(':file').val('');
                    $('#Submit_err_msg').html("");
                    
                }
                
               

                
                //console.log(base64);
            };
            // Convert data to base64
            fileReader.readAsDataURL(fileToLoad);

        }










    });
});

//function imageToDataUri(base) {

//    var canvas1 = document.createElement("canvas");
//    var ctx1 = canvas1.getContext("2d");

//    var img = new Image();
//    img.src = base;
   
//    img.onload = function () {

//        var newWidth = Math.floor(img.width * 1.5);
//        var newHeight = Math.floor(img.height * 1.5);

//        console.log("new width " + newWidth);
//        console.log("new height " + newHeight);

//        img.width = newWidth;
//        img.height = newHeight;

//        canvas1.width = newWidth;
//        canvas1.height = newHeight;

//        ctx1.drawImage(img, 0, 0, newWidth, newHeight);
//    }
//    debugger;
//    console.log("test"+canvas1.toDataURL());
//    return canvas1.toDataURL();
//}

function imageIsLoaded(e) {

    var img_src_64 = e.target.result; // Original Image base64

    // Resize code starting
    var canvas1 = document.createElement("canvas");
    var ctx1 = canvas1.getContext("2d");

    var img = new Image();
    img.src = img_src_64;

    img.onload = function () {

        var newWidth = Math.floor(img.width * 2.0);
        var newHeight = Math.floor(img.height * 2.0);

        console.log("new width " + newWidth);
        console.log("new height " + newHeight);

        img.width = newWidth;
        img.height = newHeight;

        canvas1.width = newWidth;
        canvas1.height = newHeight;

        ctx1.drawImage(img, 0, 0, newWidth, newHeight);

        var resized_base64 = canvas1.toDataURL(); // Resized image base64
        console.log(" resized image "+resized_base64);

        console.log("resized width " + canvas1.width + " resized width " + canvas1.height)


        // Resize code Ending

        var img_64_array = img_src_64.split(','); // Original Image base64
        //var img_64_array = resized_base64.split(','); // Resized Image base64
        var img_extension = img_64_array[0];

        if (img_extension == "data:image/png;base64" || img_extension == "data:image/PNG;base64" || img_extension == "data:image/jpeg;base64" || img_extension == "data:image/JPEG;base64" || img_extension == "data:image/jpg;base64" || img_extension == "data:image/JPG;base64" || img_extension == "data:application/PDF;base64" || img_extension == "data:application/PDF;base64") {
            $('#file_err_msg').html("");
            $('#process_error_msg').html("");
            $('#preview_img').attr('src', e.target.result);
            $('#Submit_err_msg').html("");
        }
        else {
            $('#file_err_msg').html("Please upload a valid file");
            $('#file_err_msg').css('color', 'red');
            $('#preview_img').attr('src', '/TATAAIGassets/img/preview.png');
            $(':file').val('');
            $('#Submit_err_msg').html("");
        }
    }
};


$('#process_btn').on("click", function () {

    debugger;
    $("#process_error_msg").html("");

    //var preview_img_src = $('#preview_img').attr('src');
    
    //if (preview_img_src == "/TATAAIGassets/img/preview.png") {
        
    //}
    //else {
    //    var img_64_array = preview_img_src.split(',');

       
        
    //}   
    var get_cheque_type = $('input[name="get_image_type"]:checked').val();
    var Url = "/Ajax/JSNAsyncChequeExtract/";

    if (get_cheque_type==2) {
        Url = "/Ajax/JSNAsyncCancelledChequeExtract/";
    }
    var ImageFile = $("#ImageFile").val();
    var allowedFiles = ["jpg","jpeg","png","pdf"];

    if (ImageFile == "") {
        $('#process_error_msg').html("Please upload a valid file");
        $("#process_error_msg").css("color", "red");
    }
    else if ($.inArray(ImageFile.split('.').pop().toLowerCase(), allowedFiles) == -1) {
        $('#process_error_msg').html("Please upload a valid file");
        $("#process_error_msg").css("color", "red");
    }
    else {
        var get_loading_text = $(this).attr('data-loading-text');

        $('#process_btn').html(get_loading_text);

        $("#process_btn").attr("disabled", true);

        //var UserData = JSON.stringify({
        //    ImageData: img_64_array[1]
        //});
        var obj = {};
        obj.ImageData = $('#preview_img').attr('src');
        var dataObject = JSON.stringify(obj);
        console.log(obj);
        debugger;
        $.ajax({
            type: "POST",
            //contentType: "application/json",
            //datatype: "json",
            data: { dataObject: dataObject },
            url: Url,
            success: function (response) {
                debugger;
                console.log(response);
                try {
                    if (response.StatusCode == "200") {
                        $('#insurance_section_div').show();
                        $('input:checkbox').each(function () {
                            this.checked = false;
                        });
                        $('#process_btn').html("Process");

                        $("#process_btn").attr("disabled", false);

                        $('#v1_payee_name').val(response.PayeeName);
                        $('#v2_payee_name').val(response.PayeeName);

                        $('#v1_bank_name').val(response.BankName);
                        $('#v2_bank_name').val(response.BankName);

                        $('#v1_cheque_date').val(response.Date);
                        $('#v2_cheque_date').val(response.Date);

                        $('#v1_amount_in_digits').val(response.AmountInDigits);
                        $('#v2_amount_in_digits').val(response.AmountInDigits);

                        $('#v1_amount_in_words').html(response.AmountInWords);
                        $('#v2_amount_in_words').html(response.AmountInWords);

                        $('#v1_account_no').val(response.AccountNumber);
                        $('#v2_account_no').val(response.AccountNumber);

                        $('#v1_cheque_no').val(response.ChequeNumber);
                        $('#v2_cheque_no').val(response.ChequeNumber);

                        $('#v1_ifsc_code').val(response.IFSC);
                        $('#v2_ifsc_code').val(response.IFSC);

                        $('#v1_payername').val(response.PayerName);
                        $('#v2_payername').val(response.PayerName);


                        $('#v1_branch_name').val(response.BranchName);

                        $('#v1_amountfieldmatch').val(response.AmountFieldMatch == true ? "1" : "0");
                        $('#v2_amountfieldmatch').val(response.AmountFieldMatch == true ? "1" : "0");

                        $('#v1_validdate').val(response.ValidDate == true ? "1" : "0");
                        $('#v2_validdate').val(response.ValidDate == true ? "1" : "0");


                        $('#v1_allfieldextracted').val(response.AllFieldsExtracted == true ? "1" : "0");
                        $('#v2_allfieldextracted').val(response.AllFieldsExtracted == true ? "1" : "0");


                        $('#v1_ispayeenamevalid').val(response.IsPayeeNameValid == true ? "1" : "0");
                        $('#v2_ispayeenamevalid').val(response.IsPayeeNameValid == true ? "1" : "0");

                        

                        console.log(response.PayerName);

                        $('#document_id').val(response.DocValidationID);

                    } else if (response.StatusCode == "500") {
                        $('#process_error_msg').html(response.Message);
                        $("#process_error_msg").css("color", "red");
                        $('#process_btn').html("Process");
                        $("#process_btn").attr("disabled", false);
                    } else {
                        $('#process_error_msg').html("");
                        $("#process_error_msg").css("color", "red");
                        $('#process_btn').html("Process");
                        $("#process_btn").attr("disabled", false);
                    }
                } catch (err) {
                    $('#process_error_msg').html("Please try again");
                    $("#process_error_msg").css("color", "red");
                    $('#process_btn').html("Process");
                    $("#process_btn").attr("disabled", false);
                }
            },
            error: function (response) {
                $('#process_error_msg').html("Manual error for image");
                $("#process_error_msg").css("color", "red");
                $('#process_btn').html("Process");
                $("#process_btn").attr("disabled", false);
            }
        });
    }


});



$('#submit_btn').on("click", function (event) {
    event.preventDefault();
    debugger;
    var document_id = $('#document_id').val();

    var PerfectArray = [];
    var UnCheckedArray = [];
    var CheckedArray = [];

    $('.v1_check_class').each(function () {
        if ($('#' + this.id).prop("checked") == true) {
            PerfectArray.push(this.id);
        }
    });

    $('.v2_class').each(function () {
        if ($('#' + this.id).is('[readonly]')) {
            UnCheckedArray.push(this.id);
        }
        else {
            CheckedArray.push(this.id);
        }
    });

    var total_Checks = PerfectArray.length + CheckedArray.length;
    
    if (total_Checks == 13) {

    
    var empty_val_arr = [];

    for (i = 0; i < CheckedArray.length; i++) {
        var get_field = $('#' + CheckedArray[i]).val().trim();
        if (get_field == "") {
            empty_val_arr.push(CheckedArray[i]);
        }
    }
        console.log(get_field);
    if (empty_val_arr.length == 0) {
        //var v1_bank_name = $('#v1_bank_name').val();
        var v1_payee_name = $('#v1_payee_name').val();
        //var v1_cheque_no = $('#v1_cheque_no').val();
        //var v1_cheque_date = $('#v1_cheque_date').val();
        //var v1_amount_in_words = $('#v1_amount_in_words').val();
        //var v1_amount_in_digits = $('#v1_amount_in_digits').val();
        //var v1_account_no = $('#v1_account_no').val();
        //var v1_ifsc_code = $('#v1_ifsc_code').val();
        var v2_bank_name = $('#v2_bank_name').val();
        var v2_payee_name = $('#v2_payee_name').val();
        var v2_cheque_no = $('#v2_cheque_no').val();
        var v2_cheque_date = $('#v2_cheque_date').val();
        var v2_amount_in_words = $('#v2_amount_in_words').val();
        var v2_amount_in_digits = $('#v2_amount_in_digits').val();
        var v2_account_no = $('#v2_account_no').val();
        var v2_ifsc_code = $('#v2_ifsc_code').val();
        var v2_payername = $('#v2_payername').val();
        var v2_amountfieldmatch = $('#v2_amountfieldmatch').val();
        var v2_validdate = $('#v2_validdate').val();
        var v2_allfieldextracted = $('#v2_allfieldextracted').val();
        var v2_ispayeenamevalid = $('#v2_ispayeenamevalid').val();
        
        
        

        
        


        var BankNameVal = ($('#bank_name_fail').prop("checked") == true) ? 0 : 1
        var PayeeNameVal = ($('#payee_name_fail').prop("checked") == true) ? 0 : 1
        var ChequeNoVal = ($('#cheque_no_fail').prop("checked") == true) ? 0 : 1
        var ChequeDateVal = ($('#cheque_date_fail').prop("checked") == true) ? 0 : 1
        var AmtInWordsVal = ($('#amount_in_words_fail').prop("checked") == true) ? 0 : 1
        var AmtInDigitsVal = ($('#amount_in_digits_fail').prop("checked") == true) ? 0 : 1
        var AccountNumberVal = ($('#account_no_fail').prop("checked") == true) ? 0 : 1
        var IFSCVal = ($('#ifsc_code_fail').prop("checked") == true) ? 0 : 1
        var PayerNameVal = ($('#ifsc_code_fail').prop("checked") == true) ? 0 : 1
        var AmountFieldMatchVal = ($('#amoutnfieldmatch_fail').prop("checked") == true) ? 0 : 1
        var ValidDateVal = ($('#validdate_fail').prop("checked") == true) ? 0 : 1
        var AllFieldsExtractedVal = ($('#allfieldextracted_fail').prop("checked") == true) ? 0 : 1
        var IsPayeeNameValidVal = ($('#ispayeenamevalid_fail').prop("checked") == true) ? 0 : 1

        
        
        


        var ResData = JSON.stringify({
            DocumentValID: document_id,
            //v1_bank_name: v1_bank_name,
            v1_payee_name: v1_payee_name,
            //v1_cheque_no: v1_cheque_no,
            //v1_cheque_date: v1_cheque_date,
            //v1_amount_in_words: v1_amount_in_words,
            //v1_amount_in_digits: v1_amount_in_digits,
            //v1_account_no: v1_account_no,
            //v1_ifsc_code: v1_ifsc_code,
            v2_bank_name: v2_bank_name,
            v2_payee_name: v2_payee_name,
            v2_cheque_no: v2_cheque_no,
            v2_cheque_date: v2_cheque_date,
            v2_amount_in_words: v2_amount_in_words,
            v2_amount_in_digits: v2_amount_in_digits,
            v2_account_no: v2_account_no,
            v2_ifsc_code: v2_ifsc_code,
            v2_payername: v2_payername, 
            v2_amountfieldmatch: v2_amountfieldmatch,
            v2_validdate: v2_validdate,
            v2_allfieldextracted: v2_allfieldextracted,
            v2_ispayeenamevalid: v2_ispayeenamevalid,
            BankNameVal: BankNameVal,
            PayeeNameVal: PayeeNameVal,
            ChequeNoVal: ChequeNoVal,
            ChequeDateVal: ChequeDateVal,
            AmtInWordsVal: AmtInWordsVal,
            AmtInDigitsVal: AmtInDigitsVal,
            AccountNumberVal: AccountNumberVal,
            IFSCVal: IFSCVal,
            PayerNameVal: PayerNameVal,
            AmountFieldMatchVal: AmountFieldMatchVal,
            ValidDateVal: ValidDateVal,
            AllFieldsExtractedVal: AllFieldsExtractedVal,
            IsPayeeNameValidVal: IsPayeeNameValidVal,
            PerfectCount: PerfectArray.length
        });

        var Url = "/Ajax/DocumentResult/";
        console.log(ResData);
        debugger;
        $.ajax({
            type: "POST",
            contentType: "application/json",
            datatype: "json",
            data: ResData,
            url: Url,
            success: function (response) {
                console.log(response);
                try {
                    if (response.StatusCode == "200") {
                        //$('#submit_error_msg').html("All Details Inserted Successfully");
                        //$("#submit_error_msg").css("color", "Green");
                         review("All Details are Updated Successfully!");

                    } else if (response.StatusCode == "500") {
                        $('#submit_error_msg').html("Problem Inserting Details in the table");
                        $("#submit_error_msg").css("color", "red");
                    } else {
                        $('#submit_error_msg').html("");
                        $("#submit_error_msg").css("color", "red");
                    }
                } catch (err) {
                    $('#submit_error_msg').html("Please try again");
                    $("#submit_error_msg").css("color", "red");
                }
            },
            error: function (response) {
                $('#submit_error_msg').html("Please try again");
                $("#submit_error_msg").css("color", "red");
            }
        });
    }
    else {
        $('#submit_error_msg').html("Please fill all the fields");
        $("#submit_error_msg").css("color", "red");
    }
}
    else {
        $('#submit_error_msg').html("Please fill all the fields");
        $("#submit_error_msg").css("color", "red");
    }
});

$('#logout_btn').on("click", function (event) {
    event.preventDefault();
    var Url = "/Ajax/LogoutCheck/";
    var ResData = "";
    $.ajax({
        type: "POST",
        contentType: "application/json",
        datatype: "json",
        data: ResData,
        url: Url,
        success: function (response) {
            console.log(response);
            try {
                if (response.StatusCode == "200") {
                    location.href = '/Ajax/Index';
                }
                else {
                    alert("Something went wrong,Please try again");
                }
            } catch (err) {
                alert("Something went wrong,Please try again");
            }
        },
        error: function (response) {
            alert("Something went wrong,Please try again");
        }
    });
    
});

function review(Message) {
    var html = '<div class="modal fade" id="alert_popup" role="dialog" data-keyboard="false" data-backdrop="static"><div class="modal-dialog"><div class="modal-content"><div class="modal-body"><center><h4 class="mb-4">' + Message + '</h4><a href="/Ajax/TATAAIG/"><button type="button" class="btn btn-primary">Okay</button> </a></center></div></div></div></div>';
    document.getElementById("alert_popup_div").innerHTML = html;
    $('#alert_popup').modal('show');
    //setTimeout(function () {
    //    window.location.href = '/Ajax/TATAAIG/';
    //}, 2000);
}

$('.refresh_click_btn').on("click", function (event) {
    event.preventDefault();
    var get_id = $(this).attr('id');
    if (get_id == 1) {
        var get_name = $('#v1_bank_name').val().trim();
    }
    else if (get_id == 2) {
        var get_name = $('#v1_payee_name').val().trim();
    }
    if (get_name != "") {
        var ResData = JSON.stringify({
            get_id: get_id,
            get_name: get_name
        });

        var Url = "/Ajax/Auto_NameCorrect/";

        $.ajax({
            type: "POST",
            contentType: "application/json",
            datatype: "json",
            data: ResData,
            url: Url,
            success: function (response) {
                console.log(response);
                try {
                    if (response.StatusCode == "200") {

                        if (response.get_id == 1) {
                            $('#v1_bank_name').val(response.CorrectedName);
                            $('#v2_bank_name').val(response.CorrectedName);
                            $('#v1_bank_name_msg').html("Autocorrected successfully");
                            $("#v1_bank_name_msg").css("color", "black");
                            setTimeout(function () {
                                $('#v1_bank_name_msg').html("")
                            }, 2000);
                        }
                        else if (response.get_id == 2) {
                            $('#v1_payee_name').val(response.CorrectedName);
                            $('#v2_payee_name').val(response.CorrectedName);
                            $('#v1_payee_name_msg').html("Autocorrected successfully");
                            $("#v1_payee_name_msg").css("color", "black");
                            setTimeout(function () {
                                $('#v1_payee_name_msg').html("")
                            }, 2000);
                        }
                    } else if (response.StatusCode == "500") {
                        if (response.get_id == 1) {

                            $('#v1_bank_name_msg').html("Something went wrong,Please try again");
                            setTimeout(function () {
                                $('#v1_bank_name_msg').html("")
                            }, 2000);
                        }
                        else if (response.get_id == 2) {

                            $('#v1_payee_name_msg').html("Something went wrong,Please try again");
                            setTimeout(function () {
                                $('#v1_payee_name_msg').html("")
                            }, 2000);
                        }
                    }
                } catch (err) {
                    if (response.get_id == 1) {

                        $('#v1_bank_name_msg').html("Something went wrong,Please try again");
                        setTimeout(function () {
                            $('#v1_bank_name_msg').html("")
                        }, 2000);
                    }
                    else if (response.get_id == 2) {

                        $('#v1_payee_name_msg').html("Something went wrong,Please try again");
                        setTimeout(function () {
                            $('#v1_payee_name_msg').html("")
                        }, 2000);
                    }
                }
            },
            error: function (response) {
                if (response.get_id == 1) {

                    $('#v1_bank_name_msg').html("Something went wrong,Please try again");
                    setTimeout(function () {
                        $('#v1_bank_name_msg').html("")
                    }, 2000);
                }
                else if (response.get_id == 2) {
                    $('#v1_payee_name_msg').html("Something went wrong,Please try again");
                    setTimeout(function () {
                        $('#v1_payee_name_msg').html("")
                    }, 2000);
                }
            }
        });

    }
    else {
        if (get_id == 1) {
            $('#v1_bank_name_msg').html("Field empty");
            setTimeout(function () {
                $('#v1_bank_name_msg').html("")
            }, 2000);
        }
        else if (get_id == 2) {
            $('#v1_payee_name_msg').html("Field empty");
            setTimeout(function () {
                $('#v1_payee_name_msg').html("")
            }, 2000);
        }
    }
    
});


$('#cancel_btn').on("click", function (event) {
    window.location.href = '/Ajax/TATAAIG/';
});


$('#security_key_button').on("click", function (event) {
    $('#security_key_err_msg').html("");
    event.preventDefault();
    $('#preview_img').attr('src', '/TATAAIGassets/img/preview.png');
    $('#insurance_section_div').hide();
    var Url = "/Ajax/Fetching_Securitykey/";
    var ResData = "";
    $.ajax({
        type: "POST",
        contentType: "application/json",
        datatype: "json",
        data: ResData,
        url: Url,
        success: function (response) {
            console.log(response);
            try {
                if (response.StatusCode == "200") {
                    //console.log(response);
                    $('#security_value').html(response.ImageKey);
                    $('#security_key_button').prop('disabled', true);
                    $('#ImageID').val(response.ImageID);
                    $('#ImageKey').val(response.ImageKey);

                    $('#security_msg').show();
                    $('#refresh_button').show();
                    $('#security_key_err_msg').html("");
                }
                else if (response.StatusCode == "500") {
                    $('#security_key_err_msg').html(response.result);
                }
                else {
                    $('#security_key_err_msg').html(response.result);
                }
            } catch (err) {
                $('#security_key_err_msg').html("Something went wrong,Please try again");
            }
        },
        error: function (response) {
            $('#security_key_err_msg').html("Something went wrong,Please try again");
        }
    });
});


$('#refresh_button').on("click", function (event) {
    event.preventDefault();
    $('#security_key_err_msg').html("");
    var IID = $('#ImageID').val();
    var IKey = $('#ImageKey').val();
  

    var Url = "/Ajax/Fetching_PhoneImage/";
    var ResData = JSON.stringify({
            ImgID: IID,
            ImgKey:IKey
        });

    $.ajax({
        type: "POST",
        contentType: "application/json",
        datatype: "json",
        data: ResData,
        url: Url,
        success: function (response) {
            console.log(response);
            try {
                if (response.StatusCode == "200") {
                    $('#preview_img').attr('src', response.result); 
                    $('#security_value').html("");
                    $('#security_msg').hide();
                    $('#refresh_button').hide();
                    $('#security_key_button').prop('disabled', false);
                    $('#security_key_err_msg').html("");
                }
                else if (response.StatusCode == "500") {
                    $('#security_key_err_msg').html(response.result);
                }
                else {
                    $('#security_key_err_msg').html(response.result);
                }
            } catch (err) {
                $('#security_key_err_msg').html("Something went wrong,Please try again");
            }
        },
        error: function (response) {
            $('#security_key_err_msg').html("Something went wrong,Please try again");
        }
    });

});






//$(function () {
//    $(".payeename_radio").click(function () {
//        if ($(this).val() === "payee_name_fail") {
//            // alert('test');
//            $("#payee_name_when_false").show("");
//        }
//        else {
//            $("#payee_name_when_false").hide("");
//            $("#payee_name_when_false").val("");
//        }

//    });
//});
//$(function () {
//    $(".bankname_radio").click(function () {
//        if ($(this).val() === "bank_name_fail") {
//            $("#bank_name_when_false").show("");
//        }
//        else {
//            $("#bank_name_when_false").hide("");
//            $("#bank_name_when_false").val("");
//        }
//    });
//});
//$(function () {
//    $(".chequedate_radio").click(function () {
//        if ($(this).val() === "cheque_date_fail") {
//            $("#cheque_date_when_false").show("");
//        }
//        else {
//            $("#cheque_date_when_false").hide("");
//            $("#cheque_date_when_false").val("");
//        }
//    });
//});
//$(function () {
//    $(".amountindigits_radio").click(function () {
//        if ($(this).val() === "amount_in_digits_fail") {
//            $("#amount_in_digits_when_false").show("");
//        }
//        else {
//            $("#amount_in_digits_when_false").hide("");
//            $("#amount_in_digits_when_false").val("");
//        }
//    });
//});
//$(function () {
//    $(".amountinwords_radio").click(function () {
//        if ($(this).val() === "amount_in_words_fail") {
//            $("#amount_in_words_when_false").show("");
//        }
//        else {
//            $("#amount_in_words_when_false").hide("");
//            $("#amount_in_words_when_false").val("");
//        }
//    });
//});
//$(function () {
//    $(".accountnumber_radio").click(function () {
//        if ($(this).val() === "account_number_fail") {
//            $("#account_number_when_false").show("");
//        }
//        else {
//            $("#account_number_when_false").hide("");
//            $("#account_number_when_false").val("");
//        }
//    });
//});
////$(function () {
////    $(".customername_radio").click(function () {
////        if ($(this).val() === "customer_name_fail") {

////            $("#customer_name_when_false").show("");

////        }
////        else {
////            $("#customer_name_when_false").hide("");
////            $("#customer_name_when_false").val("");
////        }
////    });
////});



////$(function () {
////    $(".ctscomplaint_radio").click(function () {
////        if ($(this).val() === "cts_complaint_fail") {

////            $("#cts_complaint_when_false").show("");

////        }
////        else {
////            $("#cts_complaint_when_false").hide("");
////            $("#cts_complaint_when_false").val("");
////        }
////    });
////});

//$(function () {
//    $(".chequenumber_radio").click(function () {
//        if ($(this).val() === "cheque_number_fail") {

//            $("#cheque_number_when_false").show("");

//        }
//        else {
//            $("#cheque_number_when_false").hide("");
//            $("#cheque_number_when_false").val("");
//        }
//    });
//});
//$(function () {
//    $(".ifsccode_radio").click(function () {
//        if ($(this).val() === "ifsc_code_fail") {

//            $("#ifsc_code_when_false").show("");

//        }
//        else {
//            $("#ifsc_code_when_false").hide("");
//            $("#ifsc_code_when_false").val("");
//        }
//    });
//});



function get_mime_type(base64String) {
    debugger;
    var strings = base64String.split(",");
    var extension="";
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