using FR_UI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;

namespace FR_UI.Controllers
{
    public class WebApiController : ApiController
    {
        [HttpPost]
        [Route("GetTiffExtraction")]
        public async Task<object> GetTiffExtraction()
        {
            HttpRequestHeaders headers = this.Request.Headers;
            try
            {
                var imagestring = "";
                string filetype = "";
                string base64string = "";
                if (headers.Contains("GUID"))
                {
                    var authtoken = headers.GetValues("GUID").First();
                    if (authtoken == "e2e5f02b-a67d-416d-a4ab-091172ee3207")
                    {
                        MediaTypeHeaderValue MediaType = this.Request.Content.Headers.ContentType;
                        if (MediaType.MediaType == "application/octet-stream")
                        {
                            imagestring = Convert.ToBase64String(Request.Content.ReadAsByteArrayAsync().Result);
                        }
                        else
                        {
                            return Json(new { StatusCode = "400", Message = "Invalid document type" });
                        }
                        //// file type
                        if (imagestring != "")
                        {
                            filetype = DataGallery.GetFileExtension(imagestring);
                            bool filesize = DataGallery.GetImage(imagestring);
                            if (filetype == "jpg" || filetype == "png" || filetype == "jpeg" || filetype == "tiff")
                            {
                                if (filesize)
                                {
                                    // OCR Code Goes here
                                    ReadData.ExtractText(imagestring);
                                    var result = ReadData.ValidateAnalyzeResult(ReadData.ALR);
                                    if (result.statusCode == 200)
                                    {
                                        return Json(new { StatusCode = "200", Result = result });
                                    }

                                    return Json(new { StatusCode = "300", Result = "Invalid Data"});
                                }
                                else
                                {
                                    return Json(new { StatusCode = "302", Message = "Invalid filesize", Is_Readable = 0, pureOcrText = "", OcrExtratedData = "" });
                                }
                            }
                            else
                            {
                                return Json(new { StatusCode = "301", Message = "Unsupported Image Format", Is_Readable = 0, pureOcrText = "", OcrExtratedData = "" });
                            }

                        }
                        else
                        {
                            return Json(new { StatusCode = "300", Message = "Please upload a File.", Is_Readable = 0, pureOcrText = "", OcrExtratedData = "" });
                        }
                    }
                    else
                    {
                        return Json(new { StatusCode = "300", Message = "Invalid GUID code", Is_Readable = 0, pureOcrText = "", OcrExtratedData = "" });
                    }
                }
                else
                {
                    return Json(new { StatusCode = "400", Message = "Missed GUID", Is_Readable = 0, pureOcrText = "", OcrExtratedData = "" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { StatusCode = "500", Message = ex.Message, Is_Readable = 0, pureOcrText = "", OcrExtratedData = "" });
            }
        }
    }
}
