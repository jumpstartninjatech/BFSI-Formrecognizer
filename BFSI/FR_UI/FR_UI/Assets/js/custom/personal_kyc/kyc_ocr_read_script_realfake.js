var global_file;
$('.output_sec').hide();
//$('.show_predication').hide();

//---------------------------------------------read api button
$(document).ready(function () {
    $("#submit_btn_id").click(function () {
        console.log("global file in btn  => " + global_file);
        //$("#submit_btn_id").prop('disabled', true);
        $('#process_err_msg_response').hide();
        var combo_value = 'no_data';
        console.log("radio value   " + combo_value);
        if (global_file == "" || global_file == undefined) {
            $('#process_err_msg').html("Please upload an image");
            $('#process_err_msg').css('color', 'red');
            $('.output_sec').hide();
        } else {
            console.log("ajax started and radio value is =>  " + combo_value);
            $('#process_err_msg').hide();
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
    if ($.inArray(ext, ['png', 'jpg', 'jpeg', 'tiff', 'tif']) == -1) {
        console.log('invalid Doc');
        $('#com_vis_file_id').val('');
        $("#submit_btn_id").prop('disabled', true);
        $('#epass1').show();
        $('.content_visible_select_image').hide();
        $('.font_error_show').hide();
        $('.output_sec').hide();
        $('#process_err_msg').hide();
        $('#process_err_msg_response').hide();
    } else {
        console.log('valid Doc');
        var file = element.files[0];
        var reader = new FileReader();
        reader.onloadend = function () {
            imagebase64 = reader.result;
            //console.log(imagebase64);
            global_file = reader.result.split(',')[1];
            //  console.log("global file  =>               " + global_file);
            var mime_type = guessImageMime(global_file);
            console.log('mime_type', mime_type);
            //  $('.preview_img').attr('src', "data:" + mime_type + ";base64," + imagebase64);
            $(".preview_img").attr("src", imagebase64);


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
            //SendToReadControll();
        }
        reader.readAsDataURL(file);


    }


}



//---------------------------------------------READ ajax call of image to controller


$("#snap_btn").click(function (e) {
    e.preventDefault();
    debugger;
    $('#snap_btn').html("<i class='fa fa-spinner fa-spin'></i> Loading..");
    $('.show_predication').hide();
    var canvas = capture(video, scaleFactor);
    var image = canvas.toDataURL("image/png");
    //console.log(image);
    var img_64_array = image.split(',');
    var img_extension = img_64_array[0];
    var ImageBase64 = image.replace(img_extension + ",", "");
   // console.log('ImageBase64', ImageBase64);
    var img_obj = { image: ImageBase64 };
    var dataObject = JSON.stringify(img_obj);

  

    $.ajax({
        type: "POST",
        data: { ajax_data: dataObject},
        url: "/Ajax/RealOrFake/",
        success: function (response) {
            console.log(response);
            if (response.StatusCode == 200) {
                var prediction_accurarcy = Math.round(response.prediction_accurarcy * 100);
                if (response.prediction == "REAL") {
                    $('.predicition_value').css('color', 'green');
                } else {
                    $('.predicition_value').css('color', 'red');
                }
                $('.show_predication').show();
                $('.predicition_value').html(response.prediction);
                $('.accuracy_value').html(prediction_accurarcy);
            }
            else {
               // $("#realfake_result").html(response.Result);
                $('.show_predication').show();
                $('.predicition_value').html("No data available");
                $('.accuracy_value').html("");
            }

            $('#snap_btn').html("Take Snapshot");
        },
        error: function (data) {
            // alert("error ajax");
            console.log(data);
            $('#snap_btn').html("Take Snapshot");
            $('.show_predication').show();
            $('.predicition_value').html("No data available");
            $('.accuracy_value').html("");
        }
    });
});

function capitalizeFirstLetter(string) {
    if (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
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
