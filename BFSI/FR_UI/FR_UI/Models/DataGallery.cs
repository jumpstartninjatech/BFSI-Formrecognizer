using System;
using System.Collections.Generic;
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
    }
}