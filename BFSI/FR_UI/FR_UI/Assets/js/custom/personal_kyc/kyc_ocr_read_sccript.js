var global_file;
$('.output_sec').hide();
$('.card-body').hide();
$('#status_message_pdf').hide();

//---------------------------------------------read api button
$(document).ready(function () {
    $("#submit_btn_id").click(function () {
        debugger;
        console.log("global file in btn  => " + global_file);
        //$("#submit_btn_id").prop('disabled', true);
        $('#process_err_msg_response').hide();
        $('#status_message_pdf').hide();
        var combo_value = 'no_data';
        console.log("radio value   " + combo_value);
        if (global_file == "" || global_file == undefined) {
            $('#process_err_msg').html("Please upload an image");
            $('#process_err_msg').css('color', 'red');
            $('.output_sec').hide();
        } else {
            console.log("ajax started and radio value is =>  " + combo_value);
            $('#process_err_msg').hide();
            $('.output_sec').hide();
            Read_ajax_To_Get_Image_Controller(combo_value);
            console.log("ajax call compoleted");
        }
    });
});


//-----------------------------------------------ocr api button
//$(document).ready(function () {
//	$("#submit_btn_id_ocr").click(function () {
//		console.log("global file in btn  => " + global_file);
//		$("#submit_btn_id_ocr").prop('disabled', true);
//		//Ocr_ajax_To_Get_Image_Controller();
//	});
//});


//------------------------------------------------turn selected file ito base64
function CustomVision(element) {
    var ext = $('#com_vis_file_id').val().split('.').pop().toLowerCase();
    if ($.inArray(ext, ['png', 'jpg', 'jpeg', 'tiff', 'tif','pdf']) == -1) {
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
            global_file = reader.result.split(',')[1];
            //  console.log("global file  =>               " + global_file);
            var mime_type = guessImageMime(global_file);
            console.log('mime_type', mime_type);
            //  $('.preview_img').attr('src', "data:" + mime_type + ";base64," + imagebase64);
            $("#person_image_id").attr("src", imagebase64);
            $("#forming_img_classification").attr("src", imagebase64);

            $("#com_vis_img_display_name_id").text("Selected Image");
            $("#submit_btn_id").prop('disabled', false);
            $("#submit_btn_id_ocr").prop('disabled', true);
            $("#com_vis_res_disp_title_id").text("");
            $("#com_vis_res_disp_id_1").text("");
            $('#epass1').hide();
            $('.content_visible_select_image').show();
            $('.font_error_show').hide();
            $('.output_sec').hide();
            $('#process_err_msg').hide();
            $('#process_err_msg_response').hide();
            $('.document_img').attr('src', '');
            $('.Failed_pdf_image').attr('src', '');
            $('#status_message_pdf').hide();
            $('.Failed_pdf_image').hide();
            $('.document_img').hide();
            $('.content_header').hide();
            $('#contact-tab').hide();
            $('.card-body').hide();
            $('.Failed_pdf_image_caption_class').html("");
            //SendToReadControll();
        }
        reader.readAsDataURL(file);
    }
}

function error_doc_format() {
    $('#com_vis_file_id').val('');
    $("#submit_btn_id").prop('disabled', true);
    $('#epass1').show();
    $('.content_visible_select_image').hide();
    $('.font_error_show').hide();
    $('.output_sec').hide();
    $('#process_err_msg').hide();
    $('#process_err_msg_response').hide();
    $('#status_message_pdf').hide();
}

//---------------------------------------------READ ajax call of image to controller
function Read_ajax_To_Get_Image_Controller(radioValue) {
    debugger;
    radioValue = radioValue;
    ////debugger;
    console.log("ajax running");
    $('.font_error_show').hide();
    $('.content_extraction_info').hide();
    $('#submit_btn_id').html("<i class='fa fa-spinner fa-spin'></i> Loading..");
    $('#rule_engine_internal_img').attr('src', '/DataClassassets/img/preview.png');
    $('.voter_fname').val('');
    $('.voter_mname').val('');
    $('.voter_lname').val('');
    $('.voter_father_name').val('');
    $('.voter_dob').val('');
    $('.voter_doc_number').val('');
    $(".nav-link").removeClass("active");
    $(".tab-pane").removeClass("active");

    $("#home-tab").addClass("active");
    $("#home-1").addClass("show");
    $("#home-1").addClass("active");
    $("#submit_btn_id").prop('disabled', true);
    console.log(global_file);
    var ext = $('#com_vis_file_id').val().split('.').pop().toLowerCase();

    console.log('ext', ext);
    
    if (ext == 'pdf') {
        var url = "/Ajax/PdfProcessor/";
    } else if (ext == 'png' || ext == 'jpg' || ext == 'jpeg' || ext == 'tiff' || ext == 'tif') {
        var url = "/Ajax/GetTextFromDocument/";
    } else {
        error_doc_format();
        return false;
    }

    var img_obj = { image: global_file, filter_value: radioValue };
    var dataObject = JSON.stringify(img_obj);
    $.ajax({
        url: url,
        type: "POST",
        data: { ajax_data: dataObject },
        success: function (data) {
            console.log(data);
            $('#submit_btn_id').html("Process");
            $("#submit_btn_id").prop('disabled', false);
            $('.text-left').show();
            $('.card-body').show();

            if (ext == 'pdf') {
                process_pdf_data(data);
                return false;
            }
            var right_doc_tick = '<i style="font-size:20px;color:green;" class="far fa-check-circle font_error_show right_document"></i>';
            var wrong_doc_tick = ' <i style="font-size:20px;color:red;" class="far fa-times-circle font_error_show wrong_document"></i>';

            $('.output_sec').show();
            if (data.StatusCode == 200) {
                if (data.card_name == 1) {
                    $('.tick_aadhar').html(right_doc_tick);

                    $('.content_aadhar_card_info').show();
                    $('.aadhar_fname').val(capitalizeFirstLetter(data.customer_fname));
                    $('.aadhar_mname').val(capitalizeFirstLetter(data.customer_mname));
                    $('.aadhar_lname').val(capitalizeFirstLetter(data.customer_lname));
                    $('.aadhar_father_name').val(capitalizeFirstLetter(data.customer_father_name));
                    $('.aadhar_dob').val(data.customer_dob);
                    $('.aadhar_doc_number').val(data.customer_document_id.toUpperCase());
                    $('.Address_data_Aadhar').html(capitalizeFirstLetter(data.customer_document_address));
                    var base64_string = data.masked_image;
                    var mime_type = guessImageMime(base64_string);
                    $('#rule_engine_internal_img').attr('src', "data:" + mime_type + ";base64," + base64_string);
                    $('#rule_engine_internal_img').show();
                    $('#contact-tab').show();
                } else if (data.card_name == 2) {
                    $('.tick_pancard').html(right_doc_tick);
                    $('.content_pancard_info').show();
                    $('.pan_fname').val(capitalizeFirstLetter(data.customer_fname));
                    $('.pan_mname').val(capitalizeFirstLetter(data.customer_mname));
                    $('.pan_lname').val(capitalizeFirstLetter(data.customer_lname));
                    $('.pan_father_name').val(capitalizeFirstLetter(data.customer_father_name));
                    $('.pan_dob').val(data.customer_dob);
                    $('.pan_doc_number').val(data.customer_document_id.toUpperCase());
                } else if (data.card_name == 3) {
                    $('.tick_voterid').html(right_doc_tick);
                    $('.content_voterid_info').show();
                    $('.voter_fname').val(capitalizeFirstLetter(data.customer_fname));
                    $('.voter_mname').val(capitalizeFirstLetter(data.customer_mname));
                    $('.voter_lname').val(capitalizeFirstLetter(data.customer_lname));
                    $('.voter_father_name').val(capitalizeFirstLetter(data.customer_father_name));
                    $('.voter_dob').val(data.customer_dob);
                    $('.voter_doc_number').val(data.customer_document_id.toUpperCase()); 
                    $('.Address_data_voterid').html(capitalizeFirstLetter(data.customer_document_address));
                } else if (data.card_name == 4) {
                    $('.tick_drivinglic').html(right_doc_tick);
                    $('.content_dlno_info').show();
                    var customer_fname = (data.customer_fname != '') ? data.customer_fname : data.customer_full_name;
                    $('.dl_fname').val(capitalizeFirstLetter(customer_fname));
                    $('.dl_mname').val(capitalizeFirstLetter(data.customer_mname));
                    $('.dl_lname').val(capitalizeFirstLetter(data.customer_lname));
                    $('.dl_father_name').val(capitalizeFirstLetter(data.customer_father_name));
                    $('.dl_dob').val(data.customer_dob);
                    $('.dl_doc_number').val(data.customer_document_id.toUpperCase());
                    $('.Address_data_dl').html(capitalizeFirstLetter(data.customer_document_address));
                } else if (data.card_name == 5) {
                    $('.tick_passport').html(right_doc_tick);
                    $('.content_ppno_info').show();
                    var customer_fname = (data.customer_fname != '') ? data.customer_fname : data.customer_full_name;
                    $('.passport_fname').val(capitalizeFirstLetter(customer_fname));
                    $('.passport_mname').val(capitalizeFirstLetter(data.customer_mname));
                    $('.passport_lname').val(capitalizeFirstLetter(data.customer_lname));
                    $('.passport_father_name').val(capitalizeFirstLetter(data.customer_father_name));
                    $('.passport_dob').val(data.customer_dob);
                    $('.passport_doc_number').val(data.customer_document_id.toUpperCase());
                    $('.Address_data_passport').html(capitalizeFirstLetter(data.customer_document_address));
                } else {
                    $('.tick_invalid').html(right_doc_tick);
                    $('.form-control').val("");
                }

                $('.result_json').html(JSON.stringify(JSON.parse(data.Jresponse), null, "\t"));

            } else {
                $('.tick_invalid').html(right_doc_tick);
                console.log("error");
                $("#submit_btn_id").prop('disabled', false);
                $('#submit_btn_id').html("Process");
                $('.output_sec').hide();
                $('#process_err_msg_response').css('color', 'red');
                $('#process_err_msg_response').html(data.Message);
                $('#process_err_msg_response').show();
            }
        },
        error: function (data) {
            // alert("error ajax");
            console.log(data);
            $("#submit_btn_id").prop('disabled', false);
            $('#submit_btn_id').html("Process");
            $('.output_sec').hide();
            $('#process_err_msg_response').css('color', 'red');
            $('#process_err_msg_response').html("Something Went Wrong");
            $('#process_err_msg_response').show();
        }
    });
}

function capitalizeFirstLetter(string) {
    if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
        return "";
    }

}

function capitalizeAllLetter(string) {
    if (string) {
        return string.toUpperCase();
    } else {
        return "";
    }

}

function process_pdf_data(Result) {
    console.log('PDF data', Result);
    debugger;
    var right_doc_tick = '<i style="font-size:20px;color:green;" class="far fa-check-circle font_error_show right_document"></i>';
    var wrong_doc_tick = ' <i style="font-size:20px;color:red;" class="far fa-times-circle font_error_show wrong_document"></i>';
    $("input[type=text], textarea.Address_data_Aadhar, textarea.Address_data_voterid, textarea.Address_data_dl, textarea.Address_data_passport").val("");
    var total_success_docs = 0;
    var total_failed_docs = 0;
    var failed_document_pages = "";
    var failed_document_pages_image = "";
    var failed_image_count = 0;
    if (Result.length >= 1) {
        for (var i = 0; i < Result.length; i++) {
            console.log('Array data', Result[i]);
            //console.log('Array data', Result[i]['documentdata']['customer_dob']);
            //console.log('Array data', Result[i]['status']['Card_Name']);
            //console.log('Array data', Result[i]['status']['StatusCode']);
            if (Result[i]['status']['StatusCode'] == 200) {
                var customer_document_id = Result[i]['documentdata']['customer_document_id'];
                var customer_fname = Result[i]['documentdata']['customer_fname'];
                var customer_mname = Result[i]['documentdata']['customer_mname'];
                var customer_lname = Result[i]['documentdata']['customer_lname'];
                var customer_full_name = Result[i]['documentdata']['customer_full_name'];
                var customer_father_name = Result[i]['documentdata']['customer_father_name'];
                var customer_dob = Result[i]['documentdata']['customer_dob'];
                var customer_document_address = Result[i]['documentdata']['customer_document_address'];
                var customer_document_image = Result[i]['documentdata']['customer_document_image'];
                var customer_document_image_page_number = Result[i]['status']['Page_Number'];
                var customer_image_mime_type = guessImageMime(customer_document_image);

                $('.output_sec').show();
                if (Result[i]['status']['Card_Name'] == 1) {
                    $('.tick_aadhar').html(right_doc_tick);
                    $('.content_aadhar_card_info').show();
                    $('.content_header').show();

                    if ($('.aadhar_fname').val() == "") {  $('.aadhar_fname').val(capitalizeFirstLetter(customer_fname)); } 
                    if ($('.aadhar_mname').val() == "") { $('.aadhar_mname').val(capitalizeFirstLetter(customer_mname)); }
                    if ($('.aadhar_lname').val() == "") { $('.aadhar_lname').val(capitalizeFirstLetter(customer_lname)); }
                    if ($('.aadhar_father_name').val() == "") { $('.aadhar_father_name').val(capitalizeFirstLetter(customer_father_name)); }
                    if ($('.aadhar_dob').val() == "") { $('.aadhar_dob').val(customer_dob); }
                    if ($('.aadhar_doc_number').val() == "") { $('.aadhar_doc_number').val(capitalizeAllLetter(customer_document_id)); }
                    if ($('.Address_data_Aadhar').val() == "") { $('.Address_data_Aadhar').val(capitalizeFirstLetter(customer_document_address)); }
                    /*console.log("customer image " + customer_document_image);*/
                    $("#aadhar_document_image").attr('src', "data:" + customer_image_mime_type + ";base64," + customer_document_image);
                    $("#aadhar_page_count").text("Page " + customer_document_image_page_number);
                    $("#aadhar_page_number_id").text("Aadhar Card Info - Page " + customer_document_image_page_number);
                    $("#aadhar_document_image").show();

                    /*$('#content_building_img').val(customer_dob);*/

                    var base64_string = Result[i]['documentdata']['Masked_Image'];
                    var mime_type = guessImageMime(base64_string);
                    $('#rule_engine_internal_img').attr('src', "data:" + mime_type + ";base64," + base64_string);
                    $('#rule_engine_internal_img').show();
                    $('#contact-tab').show();
                } else if (Result[i]['status']['Card_Name'] == 2) {
                    $('.tick_pancard').html(right_doc_tick);
                    $('.content_pancard_info').show();
                    $('.content_header').show();
                    $('.pan_fname').val(capitalizeFirstLetter(customer_fname));
                    $('.pan_mname').val(capitalizeFirstLetter(customer_mname));
                    $('.pan_lname').val(capitalizeFirstLetter(customer_lname));
                    $('.pan_father_name').val(capitalizeFirstLetter(customer_father_name));
                    $('.pan_dob').val(customer_dob);
                    $('.pan_doc_number').val(capitalizeAllLetter(customer_document_id));
                    $("#pan_document_image").attr('src', "data:" + customer_image_mime_type + ";base64," + customer_document_image);
                    $("#pan_page_count").text("Page " + customer_document_image_page_number);
                    $("#pan_page_number_id").text("Pan Card Info - Page " + customer_document_image_page_number);
                    $("#pan_document_image").show();

                } else if (Result[i]['status']['Card_Name'] == 3) {
                    $('.tick_voterid').html(right_doc_tick);
                    $('.content_voterid_info').show();
                    $('.content_header').show();
                    if ($('.voter_fname').val() == "") { $('.voter_fname').val(capitalizeFirstLetter(customer_fname)); }
                    if ($('.voter_mname').val() == "") { $('.voter_mname').val(capitalizeFirstLetter(customer_mname)); }
                    if ($('.voter_lname').val() == "") { $('.voter_lname').val(capitalizeFirstLetter(customer_lname)); }
                    if ($('.voter_father_name').val() == "") { $('.voter_father_name').val(capitalizeFirstLetter(customer_father_name)); }
                    if ($('.voter_dob').val() == "") { $('.voter_dob').val(customer_dob); }
                    if ($('.voter_doc_number').val() == "") { $('.voter_doc_number').val(capitalizeAllLetter(customer_document_id)); }
                    if ($('.Address_data_voterid').val() == "") { $('.Address_data_voterid').val(capitalizeFirstLetter(customer_document_address)); }
                    $("#voter_document_image").attr('src', "data:" + customer_image_mime_type + ";base64," + customer_document_image);
                    $("#voter_page_count").text("Page " + customer_document_image_page_number);
                    $("#voter_page_number_id").text("Voter ID Info - Page " + customer_document_image_page_number);
                    $("#voter_document_image").show();

                } else if (Result[i]['status']['Card_Name'] == 4) {
                    $('.tick_drivinglic').html(right_doc_tick);
                    $('.content_dlno_info').show();
                    $('.content_header').show();
                    var customer_fname = (customer_fname != '') ? customer_fname : customer_full_name;
                    if ($('.dl_fname').val() == "") { $('.dl_fname').val(capitalizeFirstLetter(customer_fname)); }
                    if ($('.dl_mname').val() == "") { $('.dl_mname').val(capitalizeFirstLetter(customer_mname)); }
                    if ($('.dl_lname').val() == "") { $('.dl_lname').val(capitalizeFirstLetter(customer_lname)); }
                    if ($('.dl_father_name').val() == "") { $('.dl_father_name').val(capitalizeFirstLetter(customer_father_name)); }
                    if ($('.dl_dob').val() == "") { $('.dl_dob').val(customer_dob); }
                    if ($('.dl_doc_number').val() == "") { $('.dl_doc_number').val(capitalizeAllLetter(customer_document_id)); }
                    if ($('.Address_data_dl').val() == "") { $('.Address_data_dl').val(capitalizeFirstLetter(customer_document_address)); }
                    $("#driving_document_image").attr('src', "data:" + customer_image_mime_type + ";base64," + customer_document_image);
                    $("#driving_page_count").text("Page " + customer_document_image_page_number);
                    $("#driving_page_number_id").text("Driving Licence Info - Page " + customer_document_image_page_number);
                    $("#driving_document_image").show();

                } else if (Result[i]['status']['Card_Name'] == 5) {
                    $('.tick_passport').html(right_doc_tick);
                    $('.content_ppno_info').show();
                    $('.content_header').show();
                    var customer_fname = (customer_fname != '') ? customer_fname : customer_full_name;
                    $('.passport_fname').val(capitalizeFirstLetter(customer_fname));
                    $('.passport_mname').val(capitalizeFirstLetter(customer_mname));
                    $('.passport_lname').val(capitalizeFirstLetter(customer_lname));
                    $('.passport_father_name').val(capitalizeFirstLetter(customer_father_name));
                    $('.passport_dob').val(customer_dob);
                    $('.passport_doc_number').val(capitalizeAllLetter(customer_document_id));
                    $('.Address_data_passport').val(capitalizeFirstLetter(customer_document_address));
                    $("#passport_document_image").attr('src', "data:" + customer_image_mime_type + ";base64," + customer_document_image);
                    $("#passport_page_count").text("Page " + customer_document_image_page_number);
                    $("#passport_page_number_id").text("Passport Info - Page " + customer_document_image_page_number);
                    $("#passport_document_image").show();

                } else {
                    $('.tick_invalid').html(right_doc_tick);
                    $('.form-control').val("");
                }
                $('.result_json').val(JSON.stringify(JSON.parse(Result[i]['documentdata']['Json_response']), null, "\t"));
                total_success_docs = total_success_docs + 1;
            } else {                
                total_failed_docs = total_failed_docs + 1;
                var temp_failed_document_pages = Result[i]['status']['Page_Number'];
                $('#Failed_pdf_image_' + failed_image_count).show();
                $('.failed_image_class_' + failed_image_count).show();
                failed_document_pages = failed_document_pages + ", " + temp_failed_document_pages;
                failed_document_pages_image = Result[i]['documentdata']['customer_document_image'];                
                var mime_type = guessImageMime(failed_document_pages_image);
                $('#Failed_pdf_image_' + failed_image_count).attr('src', "data:" + mime_type + ";base64," + failed_document_pages_image);
                $('#Failed_pdf_image_' + failed_image_count +'_caption').text("Failed Image Page " + temp_failed_document_pages);
                failed_image_count++;
            }
            //  $('.all_card_details').trigger("reset");
            $('.output_sec').show();
            $('#status_message_pdf').show();
            $('.pdf_success_data').html(total_success_docs);
            $('.pdf_failed_data').html(total_failed_docs);
            $('.pdf_failed_page').html(failed_document_pages);
        }
    } else {
        $('#submit_btn_id').html("Process");
        $('.output_sec').hide();
        $('#process_err_msg_response').css('color', 'red');
        $('#process_err_msg_response').html("Something Went Wrong");
        $('#process_err_msg_response').show();
    }
    
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

//-----------------------------------------------------k----ocr ajax call of image to controll
//function Ocr_ajax_To_Get_Image_Controller() {
//	console.log("ajax running");
//	var img_obj = { image: global_file };
//	$.ajax({
//		url: "/Home/GetImageOcr/",
//		type: "POST",
//		data: img_obj,
//		success: function (data) {
//			alert("success ajax");
//			var x = data.text;
//			console.log("data.text   => " + x);
//		},
//		erreo: function (data) {
//			alert("error ajax");
//		}
//	});
//}

function display_choose_file() {
    $("#com_vis_file_id").prop('disabled', false);
}
