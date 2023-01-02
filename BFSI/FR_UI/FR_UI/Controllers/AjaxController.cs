using FR_UI.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FR_UI.Controllers
{
    public class AjaxController : Controller
    {
        // GET: Ajax
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GSTCustomForm(string dataObject)
        {
        try
            {
                var obj = JObject.Parse(dataObject);
                var image = (obj["document_file_base64"].ToString());
                ReadData.ExtractText(image);
                var result = ReadData.ValidateAnalyzeResult(ReadData.ALR);
                
                return Json(new { StatusCode = "200", Result = result });

            }
            catch (Exception ex)
            {
                return Json(new { StatusCode = "300", error = ex.Message });
            }
            
        }
    }
}