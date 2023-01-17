using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace FR_UI.Models
{
    public class DataGallery
    {
        public static string GetFileExtension(string imagestring)
        {
            var data = imagestring.Substring(0, 5);

            switch (data.ToUpper())
            {
                case "IVBOR":
                    return "png";
                case "/9J/4":
                    return "jpg";
                case "/9J/2":
                    return "jpeg";
                case "AAAAF":
                    return "mp4";
                case "JVBER":
                    return "pdf";
                case "AAABA":
                    return "ico";
                case "UMFYI":
                    return "rar";
                case "E1XYD":
                    return "rtf";
                case "U1PKC":
                    return "txt";
                case "77U/M":
                    return "srt";
                case "SUKQA":
                    return "tiff";
                case "TVRZM":
                    return "tiff";
                default:
                    return string.Empty;
            }
        }
        public static bool GetImage(string imagestring)
        {
            float img_len = imagestring.Length;
            float img_size_in_kb = ((img_len * 3) / 4) / 1024;
            if (img_size_in_kb < 55200)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public static void vChek_gr_infra(string sourceurl, string validateDataFormat1s, string destinationurl, string filename)
        {
            int result = 0;
            try
            {
                //string jsonStr = JsonConvert.SerializeObject(validateDataFormat1s);
                //LoginData LD = System.Web.HttpContext.Current.Session["LoginData"] as LoginData;
                //string DynamicConnectionStringFromSession = new WWCryptography().Decrypt(LD.ConnectionString, "Admin@123");
                MySqlCommand cmd = new MySqlCommand("gr_infra_console_inspection", new MySqlConnection(Connstring()));
                cmd.CommandType = CommandType.StoredProcedure;
                var activity_name = "Document Identification";
                var object_name = "RC";
                var object_id = filename;
                // activity_id - foregin key
                var activity_id = 140;
                var site_user_id = 2000;
                var user_name = "Testing";
                var employee_name = "Sample";
                var activity_message = "Pass";
                var overall_result = 1;
                var latitude = "12.914021099999998";
                var longitude = "80.18685529999999";
                var device_details = "PANASONIC, FZ-T1, 8.1.0, SDK_Ver : 22, O_MR1";
                var device_id = "2f93d4bc59dc3d0e";
                var sdk_version = 22;
                var reference_key = "3fcf5694-de91-4501-be9d-ac6549be34ca";
                var param_17 = sourceurl;
                var param_18 = validateDataFormat1s;
                var param_19 = destinationurl;
                var param_20 = "";
                cmd.Parameters.Add(new MySqlParameter("v_activity_name", activity_name));
                cmd.Parameters.Add(new MySqlParameter("v_object_name", object_name));
                cmd.Parameters.Add(new MySqlParameter("v_object_Id_value", object_id));
                cmd.Parameters.Add(new MySqlParameter("v_activity_id", activity_id));
                cmd.Parameters.Add(new MySqlParameter("v_tenant_id", "1"));
                cmd.Parameters.Add(new MySqlParameter("v_site_user_id", site_user_id));
                cmd.Parameters.Add(new MySqlParameter("v_user_name", user_name));
                cmd.Parameters.Add(new MySqlParameter("v_employee_name", employee_name));
                cmd.Parameters.Add(new MySqlParameter("v_activity_message", activity_message));
                cmd.Parameters.Add(new MySqlParameter("v_overall_result", overall_result));
                cmd.Parameters.Add(new MySqlParameter("v_latitude", latitude));
                cmd.Parameters.Add(new MySqlParameter("v_longitude", longitude));
                cmd.Parameters.Add(new MySqlParameter("v_device_details", device_details));
                cmd.Parameters.Add(new MySqlParameter("v_device_id", device_id));
                cmd.Parameters.Add(new MySqlParameter("v_sdk_version", sdk_version));
                cmd.Parameters.Add(new MySqlParameter("v_reference_key", reference_key));
                cmd.Parameters.Add(new MySqlParameter("v_site_id", 4));
                cmd.Parameters.Add(new MySqlParameter("v_site_code", "003"));
                cmd.Parameters.Add(new MySqlParameter("v_param_17", param_17));
                cmd.Parameters.Add(new MySqlParameter("v_param_18", param_18));
                cmd.Parameters.Add(new MySqlParameter("v_param_19", param_19));
                cmd.Parameters.Add(new MySqlParameter("v_param_20", param_20));
                cmd.Connection.Open();
                MySqlDataReader dr = cmd.ExecuteReader();
                dr.Read();
                result = Convert.ToInt32(dr["status_code"]) == 200 ? 1 : 0;
                dr.Close();
                //return result;
            }
            catch (Exception ex)
            {
                //return 0;
            }
        }

        public static String Connstring()
        {
            string connStr = "Database=vchek_database_staging_v4;Data Source=vinspktserver.mysql.database.azure.com; User Id=vInspktAdmin@vinspktserver;Password=Admin@123";
            return connStr;
        }
    }

    
}