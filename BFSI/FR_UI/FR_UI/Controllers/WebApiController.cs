using FR_UI.Models;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
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
                                    return Json(new { StatusCode = "302", Message = "Invalid filesize" });
                                }
                            }
                            else
                            {
                                return Json(new { StatusCode = "301", Message = "Unsupported Image Format" });
                            }

                        }
                        else
                        {
                            return Json(new { StatusCode = "300", Message = "Please upload a File." });
                        }
                    }
                    else
                    {
                        return Json(new { StatusCode = "300", Message = "Invalid GUID code" });
                    }
                }
                else
                {
                    return Json(new { StatusCode = "400", Message = "Missed GUID" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { StatusCode = "500", Message = ex.Message });
            }
        }

        public void mergeTifffiles(string[] sa)
        {
            var dest = @"D:\tifftest";
            ImageCodecInfo info = null;
            foreach (ImageCodecInfo ice in ImageCodecInfo.GetImageEncoders())
                if (ice.MimeType == "image/tiff")
                    info = ice;
            Encoder enc = Encoder.SaveFlag;
            EncoderParameters ep = new EncoderParameters(1);
            ep.Param[0] = new EncoderParameter(enc, (long)EncoderValue.MultiFrame);
            Bitmap pages = null;
            int frame = 0;
            foreach (string s in sa)
            {
                //  using (FileStream fileStream = System.IO.File.Open(s, FileMode.Open))
                {
                    if (frame == 0)
                    {
                        pages = (Bitmap)Image.FromFile(s);
                        //save the first frame
                        pages.Save(dest + @"\file_1123.tiff", info, ep);
                    }
                    else
                    {
                        //save the intermediate frames
                        ep.Param[0] = new EncoderParameter(enc, (long)EncoderValue.FrameDimensionPage);
                        Bitmap bm = (Bitmap)Image.FromFile(s);
                        pages.SaveAdd(bm, ep);
                    }
                    if (frame == sa.Length - 1)
                    {
                        //flush and close.
                        ep.Param[0] = new EncoderParameter(enc, (long)EncoderValue.Flush);
                        pages.SaveAdd(ep);
                    }
                    frame++;
                }
            }
        }
        

        public void mergeTiffPages(string str_DestinationPath, string[] sourceFiles)
        {
            System.Drawing.Imaging.ImageCodecInfo codec = null;

            foreach (System.Drawing.Imaging.ImageCodecInfo cCodec in System.Drawing.Imaging.ImageCodecInfo.GetImageEncoders())
            {
                if (cCodec.CodecName == "Built-in TIFF Codec")
                    codec = cCodec;
            }

            try
            {

                System.Drawing.Imaging.EncoderParameters imagePararms = new System.Drawing.Imaging.EncoderParameters(1);
                imagePararms.Param[0] = new System.Drawing.Imaging.EncoderParameter(System.Drawing.Imaging.Encoder.SaveFlag, (long)System.Drawing.Imaging.EncoderValue.MultiFrame);

                if (sourceFiles.Length == 1)
                {
                    System.IO.File.Copy((string)sourceFiles[0], str_DestinationPath, true);

                }
                else if (sourceFiles.Length >= 1)
                {
                    System.Drawing.Image DestinationImage = (System.Drawing.Image)(new System.Drawing.Bitmap((string)sourceFiles[0]));

                    DestinationImage.Save(str_DestinationPath, codec, imagePararms);

                    imagePararms.Param[0] = new System.Drawing.Imaging.EncoderParameter(System.Drawing.Imaging.Encoder.SaveFlag, (long)System.Drawing.Imaging.EncoderValue.FrameDimensionPage);


                    for (int i = 0; i < sourceFiles.Length - 1; i++)
                    {
                        System.Drawing.Image img = (System.Drawing.Image)(new System.Drawing.Bitmap((string)sourceFiles[i]));

                        DestinationImage.SaveAdd(img, imagePararms);
                        img.Dispose();
                    }

                    imagePararms.Param[0] = new System.Drawing.Imaging.EncoderParameter(System.Drawing.Imaging.Encoder.SaveFlag, (long)System.Drawing.Imaging.EncoderValue.Flush);
                    DestinationImage.SaveAdd(imagePararms);
                    imagePararms.Dispose();
                    DestinationImage.Dispose();

                }

            }
            catch (Exception ex)
            {
                //Response.Write(ex.Message);
            }


        }

    }
}
