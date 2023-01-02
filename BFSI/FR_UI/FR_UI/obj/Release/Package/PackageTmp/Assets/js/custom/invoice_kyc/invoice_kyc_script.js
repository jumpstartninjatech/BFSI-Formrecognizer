$(".all_pdf_content").hide();
$(".nav_header_content_data").hide();
$(".hide_perview_document_data_pdf").hide();
$("#generate_crid").hide();
$("#generate_tc").hide();
$("#generate_smc").hide();
var storePicutrValue;
$(document).ready(function () {
    $("#btn_id").click(function () {
        encodeImageFileAsURL(storePicutrValue);
        console.log("btn temp1" + storePicutrValue);
        //setTimeout(canvasImage1, 3);
        //console.log("canvas fun read");
        //simple(temp);
    });
});
$(document).ready(function () {
    $("#btn_id2").click(function () {
        canvasImage1();
        console.log("canvas fun read");
        //simple(temp);
    });
});
//------------------- store image in variable storePictureValue onchange in file
function simple(element) {
    storePicutrValue = element;
    document.getElementById("btn_id").disabled = false;
    //console.log("runngin insied" + temp1);
}

function encodeImageFileAsURL1(element) {
    debugger;
    console.log("runngin insied" + element);
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function (e) {
        imagebase64 = reader.result;
        //console.log(imagebase64);
        $("#img_id").attr("src", e.target.result);
        $("#our_disp_id").text("SELECTED IMAGE");
        //$("#img_display_name_id").text("Selected Image");

        storePicutrValue = reader.result.split(',')[1];
        SendToGetImageControll();

    }
    reader.readAsDataURL(file);

}

function getiframedata(data) {
    console.log('id data', data);
}


$("#preview_img101").load(function () {
    $(this).contents().on("mousedown, mouseup, click", function () {
        alert("Click detected inside iframe.");
    });
});

function getdatacheck(datacheck) {
    console.log('data check');
}

function get_document_content(content, button_id) {
    $(".get_content_pdf").hide();
    $("#" + content).show();
    $('.btnstyle_text').removeClass("btn-success");
    $("." + button_id).addClass("btn-success");
}

$('iframe').load(function () {
    $(this).contents().find("body").on('click', function (event) { alert('test'); });
});

jQuery(function ($) { // DOM ready
    $('.iframeWrapper').on('click', function (e) {
        e.preventDefault();

        var iframe_id = $(this).attr('iframeid');
        var pdf_content_id = $(this).attr('pdf_content_id');
        console.log(iframe_id, pdf_content_id);
        var iframe_src = $("#" + iframe_id).attr('src')
        console.log($("#" + iframe_id).attr('src'));
        image_tag = '<iframe id="preview_img2" class="doc custom_img_border" src="' + iframe_src + '" frameborder="0" style="width:100%;" height="500px"></iframe>';
        $("#div_preview_content_filepdf").html(image_tag);
        show_pdf_content_data(pdf_content_id);
        $("#show_loader").show();
        scroll_content();
        var img_obj = { img: iframe_src, pdf_content_id: pdf_content_id };
        
        $.ajax({
            url: "/Ajax/InvoiceCustomForm/",
            type: "POST",
            data: img_obj,
            success: function (data) {
                console.log('data', data);
                
                var newHTML = "";
                var newHTML_Table_One = "";
                var validation_text = "";
                $("#show_loader").hide();
                if (data.StatusCode == 200) {

                    if (pdf_content_id == 1) {

                        
                        for (var i = 0; i < data.Table_One.length; i++) {
                            console.log(data.Table_One[i]);
                            if (i > 0) {
                                if (data.Table_One[i][1] != undefined && data.Table_One[i][2] != undefined && data.Table_One[i][3] != undefined && data.Table_One[i][4] != undefined && data.Table_One[i][5] != undefined && data.Table_One[i][6] != undefined && data.Table_One[i][7] != undefined) {
                                    newHTML += '<tr><td>' + data.Table_One[i][0] + '</td><td>' + data.Table_One[i][1] + '</td><td>' + data.Table_One[i][2] + '</td><td>' + data.Table_One[i][3] + '</td><td>' + data.Table_One[i][4] + '</td><td>' + data.Table_One[i][5] + '</td><td>' + data.Table_One[i][6] + '</td><td>' + data.Table_One[i][7] + '</td></tr>';
                                }

                            }
                            var gst_rate = data.Table_One[i][3];
                        }
                        $('#invoice_no').html(capitalizeFirstLetter(data.Tag_list[0].Value));
                        $('#invoice_date').html(capitalizeFirstLetter(data.Tag_list[1].Value));
                        $('#Invoice_duedate').html(capitalizeFirstLetter(data.Tag_list[2].Value));
                        $('#sendername').html(capitalizeFirstLetter(data.Tag_list[3].Value));
                        $('#sender_address').html(capitalizeFirstLetter(data.Tag_list[4].Value));
                        $('#sender_gstin').html(capitalizeFirstLetter(data.Tag_list[5].Value));
                        $('#sender_pan').html(capitalizeFirstLetter(data.Tag_list[6].Value));
                        $('#receiver_name').html(capitalizeFirstLetter(data.Tag_list[7].Value));
                        $('#reciever_address').html(capitalizeFirstLetter(data.Tag_list[8].Value));
                        $('#reciever_gstin').html(capitalizeFirstLetter(data.Tag_list[9].Value));
                        $('#reciever_pan').html(capitalizeFirstLetter(data.Tag_list[10].Value));
                        $('#sub_total').html(capitalizeFirstLetter(data.Tag_list[11].Value));
                        $('#discount').html(capitalizeFirstLetter(data.Tag_list[12].Value));
                        $('#Taxable_amount').html(capitalizeFirstLetter(data.Tag_list[13].Value));
                        $('#cgst_amount').html(capitalizeFirstLetter(data.Tag_list[14].Value));
                        $('#sgst_amount').html(capitalizeFirstLetter(data.Tag_list[15].Value));
                        $('#grant_total').html(capitalizeFirstLetter(data.Tag_list[16].Value));
                        $('#acct_number').html(capitalizeFirstLetter(data.Tag_list[17].Value));
                        $('.gst_rate').html(gst_rate);
                        validation_text = 'correct';
                        $(".gst_calc_mode").css('color', 'green');
                        $('#html_table_content_model1data').html(newHTML);

                    }
                    else if (pdf_content_id == 2) {
                        

                        for (var i = 0; i < data.Table_One.length; i++) {
                            
                            if ((i == 2) || (i == 3)) {
                                console.log(data.Table_One[i]);
                                if (data.Table_One[i][1] != undefined && data.Table_One[i][2] != undefined && data.Table_One[i][3] != undefined && data.Table_One[i][4] != undefined && data.Table_One[i][5]) {
                                    newHTML += '<tr><td>' + data.Table_One[i][0] + '</td><td>' + data.Table_One[i][1] + '</td><td>' + data.Table_One[i][2] + '</td><td>' + data.Table_One[i][3] + '</td><td>' + data.Table_One[i][4] + '</td><td>' + data.Table_One[i][5] + '</td></tr>';
                                }

                            }
                        }
                        $('#invoice_no_m').html(capitalizeFirstLetter(data.Tag_list[0].Value));
                        $('#invoice_date_m').html(capitalizeFirstLetter(data.Tag_list[1].Value));
                        $('#sendername_m').html(capitalizeFirstLetter(data.Tag_list[2].Value));
                        $('#sender_address_m').html(capitalizeFirstLetter(data.Tag_list[3].Value));
                        $('#sender_gstin_m').html(capitalizeFirstLetter(data.Tag_list[4].Value));
                        $('#receiver_name_m').html(capitalizeFirstLetter(data.Tag_list[5].Value));
                        $('#reciever_address_m').html(capitalizeFirstLetter(data.Tag_list[6].Value));
                        $('#reciever_gstin_m').html(capitalizeFirstLetter(data.Tag_list[7].Value));
                        $('#sub_total_m').html(capitalizeFirstLetter(data.Tag_list[8].Value));
                        $('#discount_m').html(capitalizeFirstLetter(data.Tag_list[9].Value));
                        $('#Taxable_amount_m').html(capitalizeFirstLetter(data.Tag_list[10].Value));
                        $('#cgst_rate_m').html(capitalizeFirstLetter(data.Tag_list[11].Value));
                        $('#cgst_amount_m').html(capitalizeFirstLetter(data.Tag_list[12].Value));
                        $('#sgst_rate_m').html(capitalizeFirstLetter(data.Tag_list[13].Value));
                        $('#sgst_amount_m').html(capitalizeFirstLetter(data.Tag_list[14].Value));
                        $('#grant_total_m').html(capitalizeFirstLetter(data.Tag_list[15].Value));
                        $('#html_table_content_model2data').html(newHTML);
                        var cgst_rate = data.Tag_list[11].Value.slice(0, -1);
                        var sgst_rate = data.Tag_list[13].Value.slice(0, -1);
                        var cgst_amt = (data.Tag_list[10].Value * cgst_rate) / 100;
                        var sgst_amt = (data.Tag_list[10].Value * sgst_rate) / 100;
                        console.log('cgst_amt', cgst_amt);
                        console.log('sgst_amt', sgst_amt);
                        console.log('data.Tag_list[12]', data.Tag_list[12].Value);
                        if (data.Tag_list[12].Value == cgst_amt && data.Tag_list[14].Value == sgst_amt) {
                            console.log('correct');
                            validation_text = 'correct';
                            $(".gst_calc_mode").css('color', 'green');
                        } else {
                            console.log('Incorrect');
                            validation_text = 'Incorrect';
                            $(".gst_calc_mode").css('color', 'red');
                        }
                    }
                    $(".gst_calc_mode").html(validation_text);
                    $('#result_json').html(JSON.stringify(JSON.parse(data.Json), null, "\t"));
                } else {
                    console.log("error in ajax");
                    $(".nav_header_content_data").hide();
                    $(".hide_perview_document_data_pdf").hide();
                }
            },
            error: function (data) {
                console.log("error in ajax");
                $(".nav_header_content_data").hide();
                $(".hide_perview_document_data_pdf").hide();
            }
        });

        //Check File is not Empty

    });

});

function scroll_content() {
    $('html, body').animate({
        scrollTop: $(".nav_header_content_data").offset().top
    }, 2000);
}

function guessImageMime(data) {
    // console.log('first leter', data.substring(0, 5).toUpperCase);
    var first_letter = data.substring(0, 5).toUpperCase();
    console.log(first_letter);
    if (first_letter == '/9J/2') {
        return "image/jpeg";
    } else if (first_letter == '/9J/4') {
        return "image/jpg";
    } else if (first_letter == 'IVBOR') {
        return "image/png";
    } else if (first_letter == 'SUKQA') {
        return "image/tiff";
    } else if (first_letter == 'JVBER') {
        return "image/pdf";
    } else {
        return "";
    }
}

function show_pdf_content_data(pdf_content_id) {
    $(".all_pdf_content").hide();
    $(".nav_header_content_data").show();
    $(".hide_perview_document_data_pdf").show();
    if (pdf_content_id == 1) {
        $("#content_caste_pdf").show();
    } else if (pdf_content_id == 2) {
        $("#content_ppp_pdf").show();
    } else if (pdf_content_id == 3) {
        $("#content_tc_pdf").show();
    } else if (pdf_content_id == 4) {
        $("#content_smc_pdf").show();
    } else if (pdf_content_id == 5) {
        $("#content_smc_pdf1").show();
    } else if (pdf_content_id == 6) {
        $("#content_smc_pdf2").show();
    } else if (pdf_content_id == 7) {
        $("#content_smc_pdf3").show();
    }
}

function encodeImageFileAsURL(element) {
    debugger;
    var ext = $('#file_id').val().split('.').pop().toLowerCase();
    if ($.inArray(ext, ['png', 'jpg', 'jpeg', 'tiff', 'tif', 'pdf']) == -1) {
        console.log('invalid Doc');
        error_doc_format();
    } else {
        console.log('valid Doc');
        var file = element.files[0];
        var reader = new FileReader();
        reader.onloadend = function () {
            //debugger;
            imagebase64 = reader.result;
            //console.log(imagebase64);
            storePicutrValue = reader.result.split(',')[1];
            //  console.log("global file  =>               " + global_file);
            //var mime_type = guessImageMime(storePicutrValue);
            //console.log('mime_type', mime_type);
            SendToGetImageControll();
        }
        reader.readAsDataURL(file);
    }
}

function capitalizeFirstLetter(string) {
    if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
        return "";
    }

}



function SendToGetImageControll() {
    debugger;
    var img_obj = { img: storePicutrValue };
    $.ajax({
        url: "/Home/ocr_extraction/",
        type: "POST",
        data: img_obj,
        success: function (data) {
            var topFaceCount;
            //alert("success in ajax");
            //$("#com_vis_res_disp_id").text("Computer Vision Predition : " + data.Voice);
            //$("#com_vis_res_disp_title_id").text("READ PEDICTION");
            //console.log("data " + data.Voice);
            var obj = JSON.parse(data.Voice);
            console.log("data 2 " + obj.predictions[0].boundingBox.left);
            console.log("tagname " + obj.predictions[7].tagName);
            for (i = 0; i < obj.predictions.length; i++) {
                if (obj.predictions[i].tagName == "face") {
                    topFaceCount = i;
                    break
                }
            }
            console.log("return alue " + topFaceCount);
            canvasImage(20, 10, 50, 40, obj.predictions[0], obj.predictions[topFaceCount]);
            $("#res_disp_id").text("CUSTOM VISION PREDICTED IMAGE");
        },
        error: function (data) {
            alert("error in ajax");
        }
    });
}