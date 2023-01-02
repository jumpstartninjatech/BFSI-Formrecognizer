var global_file1;
var global_file2;
$('.output_sec').hide();
$('#status_message_pdf').hide();
$('.similar_results').hide();
//---------------------------------------------read api button
$(document).ready(function () {
    $("#submit_btn_id").click(function () {
        console.log("global file in btn  => " + global_file1);
        //$("#submit_btn_id").prop('disabled', true);
        $('#process_err_msg_response').hide();
        $('#status_message_pdf').hide();
        $('.similar_results').hide();
        var combo_value = 'no_data';
        console.log("radio value   " + combo_value);
        if (global_file1 == "" || global_file1 == undefined) {
            $('#process_err_msg1').html("Please upload an image");
            $('#process_err_msg1').css('color', 'red');

        } else if (global_file2 == "" || global_file2 == undefined) {
            $('#process_err_msg2').html("Please upload an image");
            $('#process_err_msg2').css('color', 'red');
        } else {
            console.log("ajax started and radio value is =>  " + combo_value);
            $('#process_err_msg').hide();
            $('#process_err_msg1').hide();
            $('#process_err_msg2').hide();
            $('.similar_results').hide();
            Read_ajax_To_Get_Image_Controller(combo_value);
            console.log("ajax call compoleted");
        }
    });
});


//-----------------------------------------------ocr api button
//$(document).ready(function () {
//	$("#submit_btn_id_ocr").click(function () {
//		console.log("global file in btn  => " + global_file1);
//		$("#submit_btn_id_ocr").prop('disabled', true);
//		//Ocr_ajax_To_Get_Image_Controller();
//	});
//});


//------------------------------------------------turn selected file ito base64
function CustomVision(element,image_value) {
    var ext = $('#com_vis_file_id').val().split('.').pop().toLowerCase();
    if ($.inArray(ext, ['png', 'jpg', 'jpeg', 'tiff', 'tif']) == -1) {
        console.log('invalid Doc');
        $('#process_err_msg' + image_value).html("Please upload an image");
        $('#process_err_msg' + image_value).css('color', 'red');
        $('#process_err_msg' + image_value).show();
        error_doc_format();
    } else {
        console.log('valid Doc');
        var file = element.files[0];
        var reader = new FileReader();
        reader.onloadend = function () {
            imagebase64 = reader.result;
            if (image_value == 1) {
                global_file1 = reader.result.split(',')[1];
                var mime_type = guessImageMime(global_file1);
                console.log('mime_type', mime_type);
                $(".preview_img" + image_value).attr("src", imagebase64);
                $('#process_err_msg1').hide();
                $('.similar_results').hide();
            } else {
                global_file2 = reader.result.split(',')[1];
                var mime_type = guessImageMime(global_file2);
                console.log('mime_type', mime_type);
                $(".preview_img" + image_value).attr("src", imagebase64);
                $('#process_err_msg2').hide();
                $('.similar_results').hide();
            }

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
            $('#status_message_pdf').hide();
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
function Read_ajax_To_Get_Image_Controller() {
    $('#submit_btn_id').html("<i class='fa fa-spinner fa-spin'></i> Loading..");

    if (global_file1 == "" || global_file1 == undefined || global_file2 == "" || global_file2 == undefined) {
        error_doc_format();
        return false;
    }  else {
        
    }
    var img_obj = { image_one_base64: global_file1, image_two_base64: global_file2};
    var dataObject = JSON.stringify(img_obj);

    $.ajax({
        url: "/Ajax/FaceSimilarityCheck/",
        type: "POST",
        data: { ajax_data: dataObject },
        success: function (data) {
            console.log(data);
            $('#submit_btn_id').html("Process");
            var right_doc_tick = '<i style="font-size:20px;color:green;" class="far fa-check-circle font_error_show right_document"></i>';
            var wrong_doc_tick = ' <i style="font-size:20px;color:red;" class="far fa-times-circle font_error_show wrong_document"></i>';
            if (data.StatusCode == 200) {
                $('.similar_results').show();
                var confidence_accurarcy = Math.round(data.AccurarcyScore);
                $('.display_result').html(confidence_accurarcy);
                if (data.IsMatching) {
                    $('.display_text').html('belongs to the same person');
                } else {
                    $('.display_text').html('does not match with each other');
                }
            } else {
                $('.similar_results').hide();
                console.log("error");
                $('#submit_btn_id').html("Process");
                $('#process_err_msg_response').css('color', 'red');
                $('#process_err_msg_response').html(data.Message);
                $('#process_err_msg_response').show();
            }
        },
        error: function (data) {
            $('.similar_results').hide();
            console.log(data);
            $('#submit_btn_id').html("Process");
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



function display_choose_file() {
    $("#com_vis_file_id").prop('disabled', false);
}
