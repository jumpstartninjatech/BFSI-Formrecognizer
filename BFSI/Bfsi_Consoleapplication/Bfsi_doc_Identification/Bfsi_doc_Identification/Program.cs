using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Bfsi_doc_Identification
{
    class Program
    {
        static string BlobStorage_Key = "Tvvve3hN7q3uNOXaQl82V26MSTPEW+qOeSdQEFcUKwBeOG7PCrhUMnWA4yI1XX3XlardqK/yhsNc+ASteTtozA==";
        static string BlobStorage_AccName = "bfsidocumentcontainer";
        static string BlobStorageContainerName = "validationimage";
        static string BlobconnectionString = "DefaultEndpointsProtocol=https;AccountName=bfsidocumentcontainer;AccountKey=Tvvve3hN7q3uNOXaQl82V26MSTPEW+qOeSdQEFcUKwBeOG7PCrhUMnWA4yI1XX3XlardqK/yhsNc+ASteTtozA==;EndpointSuffix=core.windows.net" ;

        public static object blobItem { get; set; }
        public static object blobs { get; set; }
        static void Main(string[] args)
        {
            BlobContainerClient blobContainerClient = new BlobContainerClient(BlobconnectionString, BlobStorageContainerName);
            blobContainerClient.CreateIfNotExists();
            string baseurl = "https://bfsidocumentcontainer.blob.core.windows.net/validationimage/";
            Console.WriteLine("List of Images...");
            var blobs = blobContainerClient.GetBlobs();
            if (blobItem != "")
            {
                foreach (BlobItem blobItem in blobs)
                {

                    var imagename = blobItem.Name;

                   
                    Console.WriteLine("Image Name:" + imagename);
                    Console.WriteLine("Image Name:" + blobItem.Name);
                    string blobImageName = Convert.ToString(blobItem.Name);
                    string[] split = blobImageName.Split('.');
                    string filename = split[0];
                    string url = baseurl + blobImageName;
                    var clients = new WebClient();
                    byte[] dataBytes = clients.DownloadData(new Uri(url));

                    var client = new RestClient("https://localhost:44300/GetTiffExtraction");
                    client.Timeout = -1;
                    var request = new RestRequest(Method.POST);
                    request.AddHeader("filename", filename);
                    request.AddHeader("GUID", "e2e5f02b-a67d-416d-a4ab-091172ee3207");
                    request.AddHeader("Content-Type", "application/octet-stream");
                    request.AddParameter("application/octet-stream", dataBytes, ParameterType.RequestBody);
                    IRestResponse response = client.Execute(request);
                    Console.WriteLine(response.Content);
                 }


            }
            else
            {
                Console.WriteLine("Invalid blobs");
            }
           


        }
       
    }
}
