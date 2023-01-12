using Azure.Storage;
using Azure.Storage.Files.DataLake;
using FR_UI.Models;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Auth;
using Microsoft.Azure.Storage.Blob;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace FR_UI.Controllers
{
    public class WebApiController : ApiController
    {
        public static string accountname = ConfigurationManager.AppSettings["AzureBlobStorageAccName"];
        public static string accesskey = ConfigurationManager.AppSettings["AzureBlobStorageAccKey"];
        public static string AzureDataLakeKey = ConfigurationManager.AppSettings["AzureDataLakeKey"];
        public static string AzureDataLakeAccountName = ConfigurationManager.AppSettings["AzureDataLakeAccountName"];
        public static string AzureDataLakeContainerNameDestination = ConfigurationManager.AppSettings["AzureDataLakeContainerNameDestination"];

        public static string containername = "tiffdatamerge";
        public static string datatimecurentnow,sourceurl,jsondatastring,destinationurl, distinationdatastring;

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
                string sourceBaseUrl = "https://bfsidatalakegen.blob.core.windows.net/source/";
                string destinationBaseUrl = "https://bfsidatalakegen.blob.core.windows.net/destination/";
                if (headers.Contains("GUID"))
                {
                    var authtoken = headers.GetValues("GUID").First();
                    var filename = headers.GetValues("filename").First();
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
                                    sourceurl = sourceBaseUrl + filename + "." + filetype;
                                    List<string> destinationurllist = new List<string>();
                                    byte[] imageBytes = Convert.FromBase64String(imagestring);

                                    ReadData.ExtractText(imagestring);
                                    var result = ReadData.ValidateAnalyzeResult(ReadData.ALR);

                                    if (result.statusCode == 200)
                                    {
                                        if (result.HotelDocumentPageNumber.Count() > 0)
                                        {
                                            jsondatastring = JsonConvert.SerializeObject(result.HotelDocumentPageNumber);
                                            datatimecurentnow = DateTime.Now.ToString("ddMMyyyy");
                                            destinationurl = destinationBaseUrl + filename + "_Hotelbooking_" + datatimecurentnow + "." + filetype;
                                            MergeTiff(datatimecurentnow,result.HotelDocumentPageNumber,"Hotelbooking", filename, imageBytes);
                                            destinationurllist.Add(destinationurl);
                                           // DataGallery.vChek_gr_infra(sourceurl, jsondatastring, destinationurl);
                                        }
                                        if (result.BankBookPageNumber.Count() > 0)
                                        {
                                            jsondatastring = JsonConvert.SerializeObject(result.BankBookPageNumber);
                                            datatimecurentnow = DateTime.Now.ToString("ddMMyyyy");
                                            destinationurl = destinationBaseUrl+ filename + "_Bankstatement_" + datatimecurentnow + "." + filetype;
                                            MergeTiff(datatimecurentnow, result.BankBookPageNumber,"Bankstatement", filename, imageBytes);
                                            destinationurllist.Add(destinationurl);
                                            //  DataGallery.vChek_gr_infra(sourceurl, jsondatastring, destinationurl);
                                        }
                                        if (result.BirthCertificatePageNumber.Count() > 0)
                                        {
                                            jsondatastring = JsonConvert.SerializeObject(result.BirthCertificatePageNumber);
                                            datatimecurentnow = DateTime.Now.ToString("ddMMyyyy");
                                            destinationurl = destinationBaseUrl+ filename + "_Birthcertificate_" + datatimecurentnow + "." + filetype;
                                            MergeTiff(datatimecurentnow, result.BirthCertificatePageNumber,"Birthcertificate", filename, imageBytes);
                                            destinationurllist.Add(destinationurl);
                                            // DataGallery.vChek_gr_infra(sourceurl, jsondatastring, destinationurl);
                                        }
                                        if (result.AirTicketPageNumber.Count() > 0)
                                        {
                                            jsondatastring = JsonConvert.SerializeObject(result.AirTicketPageNumber);
                                            datatimecurentnow = DateTime.Now.ToString("ddMMyyyy");
                                            destinationurl = destinationBaseUrl + filename + "_Airticket_" + datatimecurentnow + "." + filetype;
                                            MergeTiff(datatimecurentnow, result.AirTicketPageNumber,"Airticket", filename, imageBytes);
                                            destinationurllist.Add(destinationurl);
                                            // DataGallery.vChek_gr_infra(sourceurl, jsondatastring, destinationurl);
                                        }
                                        if (result.NationalIdPageNumber.Count() > 0)
                                        {
                                            jsondatastring = JsonConvert.SerializeObject(result.NationalIdPageNumber);
                                            datatimecurentnow = DateTime.Now.ToString("ddMMyyyy");
                                            destinationurl = destinationBaseUrl + filename + "_NationalID_" + datatimecurentnow + "." + filetype;
                                            MergeTiff(datatimecurentnow, result.NationalIdPageNumber,"NationalID", filename, imageBytes);
                                            destinationurllist.Add(destinationurl);
                                            // DataGallery.vChek_gr_infra(sourceurl, jsondatastring, destinationurl);
                                        }
                                        jsondatastring = JsonConvert.SerializeObject(result);
                                        distinationdatastring = JsonConvert.SerializeObject(destinationurllist);
                                        DataGallery.vChek_gr_infra(sourceurl, jsondatastring, distinationdatastring);
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

        private byte[] MergeTiff(byte[] imageBytes, List<int> hotelDocumentPageNumber)
        {
            throw new NotImplementedException();
        }

        public static void MergeTiff( string datatimecurentnow, List<int> listdata,string DocumentName,string filename, params byte[][] tiffFiles)
        {
           
            byte[] tiffMerge = null;
            using (var msMerge = new MemoryStream())
            {
                //get the codec for tiff files
                ImageCodecInfo ici = null;
                foreach (ImageCodecInfo i in ImageCodecInfo.GetImageEncoders())
                    if (i.MimeType == "image/tiff")
                        ici = i;

                Encoder enc = Encoder.SaveFlag;
                EncoderParameters ep = new EncoderParameters(1);

                Bitmap pages = null;
                int frame = 0;

                foreach (var tiffFile in tiffFiles)
                {
                    using (var imageStream = new MemoryStream(tiffFile))
                    {
                        using (Image tiffImage = Image.FromStream(imageStream))
                        {
                            foreach (Guid guid in tiffImage.FrameDimensionsList)
                            {
                                //create the frame dimension 
                                FrameDimension dimension = new FrameDimension(guid);
                                //Gets the total number of frames in the .tiff file 
                                int noOfPages = tiffImage.GetFrameCount(dimension);

                                for (int index = 0; index < noOfPages; index++)
                                {
                                    foreach (int pagenumber in listdata)
                                    {
                                        if (pagenumber - 1 == index)
                                        {
                                            FrameDimension currentFrame = new FrameDimension(guid);
                                            tiffImage.SelectActiveFrame(currentFrame, index);
                                            using (MemoryStream tempImg = new MemoryStream())
                                            {
                                                tiffImage.Save(tempImg, ImageFormat.Tiff);
                                                {
                                                    if (frame == 0)
                                                    {
                                                        //save the first frame
                                                        pages = (Bitmap)Image.FromStream(tempImg);
                                                        ep.Param[0] = new EncoderParameter(enc, (long)EncoderValue.MultiFrame);
                                                        pages.Save(msMerge, ici, ep);
                                                    }
                                                    else
                                                    {
                                                        //save the intermediate frames
                                                        ep.Param[0] = new EncoderParameter(enc, (long)EncoderValue.FrameDimensionPage);
                                                        pages.SaveAdd((Bitmap)Image.FromStream(tempImg), ep);
                                                    }
                                                }
                                                frame++;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (frame > 0)
                {
                    //flush and close.
                    ep.Param[0] = new EncoderParameter(enc, (long)EncoderValue.Flush);
                    pages.SaveAdd(ep);
                }

                msMerge.Position = 0;
                tiffMerge = msMerge.ToArray();
            }
           // string returnurldata = StoreImageInModelVaidDataCollection(tiffMerge, "tiff", filename, DocumentName);
             UploadFileBulk(tiffMerge, "tiff", filename, DocumentName, datatimecurentnow);
            //return tiffMerge;
        }

        public static string StoreImageInModelVaidDataCollection(byte[] image, string file_type,string filename, string DocumentName)
        {
            CloudBlobContainer cont = new CloudStorageAccount(new StorageCredentials(accountname, accesskey), useHttps: true).CreateCloudBlobClient().GetContainerReference(containername);
            cont.CreateIfNotExists();
            cont.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
            CloudBlockBlob cblob = cont.GetBlockBlobReference(filename + "_"+DocumentName + "_" + DateTime.Now.ToString("ddMMyyyy") + "."+ file_type);//name should be unique otherwise override at same name.  
            cblob.UploadFromStream(new MemoryStream(image));
            return cblob.Uri.AbsoluteUri;
        }

        public static async Task UploadFileBulk(byte[] image, string file_type, string filename, string DocumentName, string datatimecurentnow)
        {
            try
            {
                Uri serviceUri = new Uri("https://bfsidatalakegen.blob.core.windows.net");

                StorageSharedKeyCredential sharedKeyCredential = new StorageSharedKeyCredential(AzureDataLakeAccountName, AzureDataLakeKey);
                // Create DataLakeServiceClient using StorageSharedKeyCredentials
                DataLakeServiceClient serviceClient = new DataLakeServiceClient(serviceUri, sharedKeyCredential);
                // Create a DataLake Filesystem
                DataLakeFileSystemClient filesystem = serviceClient.GetFileSystemClient(AzureDataLakeContainerNameDestination);
                //DataLakeDirectoryClient directoryClient = serviceClient.GetDirectoryClient(AzureDataLakeContainerNameDestination);
                DataLakeFileClient fileClient = filesystem.GetFileClient(filename + "_" + DocumentName + "_" + datatimecurentnow + "." + file_type);
                await fileClient.UploadAsync(new MemoryStream(image));

            }
            catch (Exception ex)
            {

            }
            

        }

    }
}
