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
using Azure.Storage.Files.DataLake;
using Azure.Storage.Files.DataLake.Models;
using Azure.Storage;

namespace Bfsi_doc_Identification
{
    class Program
    {
        //static string BlobStorage_Key = "Tvvve3hN7q3uNOXaQl82V26MSTPEW+qOeSdQEFcUKwBeOG7PCrhUMnWA4yI1XX3XlardqK/yhsNc+ASteTtozA==";
        //static string BlobStorage_AccName = "bfsidocumentcontainer";
        //static string BlobStorageContainerName = "validationimage";
        //static string BlobconnectionString = "DefaultEndpointsProtocol=https;AccountName=bfsidocumentcontainer;AccountKey=Tvvve3hN7q3uNOXaQl82V26MSTPEW+qOeSdQEFcUKwBeOG7PCrhUMnWA4yI1XX3XlardqK/yhsNc+ASteTtozA==;EndpointSuffix=core.windows.net";

        static string BlobStorage_Key = "3nikEUUEy+iLeuHKLGlWEED7cItbxCoWDlhwHuMZvj9CyqaWjJD0eqDLv8COu3+RniypuHxwsJDS+AStQdJDFA==";
        static string BlobStorage_AccName = "bfsidatalakegen";
        static string BlobStorageContainerName = "demodatalake";
        static string BlobconnectionString = "DefaultEndpointsProtocol=https;AccountName=bfsidatalakegen;AccountKey=PkgnfsDywAJmBF8XKsIJQTFRs1SLbiUagZFhL+p5R1NmcikGBC5kxp5pQfxiGSvTuhWFvrJDNhgx+AStAgLiJg==;EndpointSuffix=core.windows.net";

        public static object blobItem { get; set; }
        public static object blobs { get; set; }
        static void Main(string[] args)
        {
            try
            {
                List<string> names = new List<string>();
               // Uri serviceUri = new Uri("https://" + BlobStorage_AccName + ".dfs.core.windows.net");
                Uri serviceUri = new Uri("https://bfsidatalakegen.blob.core.windows.net");

                StorageSharedKeyCredential sharedKeyCredential = new StorageSharedKeyCredential(BlobStorage_AccName, BlobStorage_Key);

                // Create DataLakeServiceClient using StorageSharedKeyCredentials
                DataLakeServiceClient serviceClient = new DataLakeServiceClient(serviceUri, sharedKeyCredential);

                // Create a DataLake Filesystem
                DataLakeFileSystemClient filesystem = serviceClient.GetFileSystemClient("demodatalake");
                

                foreach (PathItem pathItem in filesystem.GetPaths())
                {
                    names.Add(pathItem.Name);
                }





                BlobContainerClient blobContainerClient = new BlobContainerClient(BlobconnectionString, BlobStorageContainerName);
                blobContainerClient.CreateIfNotExists();
                //string baseurl = "https://bfsidocumentcontainer.blob.core.windows.net/validationimage/";
                string baseurl = "https://bfsidatalakegen.blob.core.windows.net/demodatalake/";
                Console.WriteLine("List of Images...");
                var blobs = blobContainerClient.GetBlobs();
                if (blobItem != "")
                {
                    foreach (BlobItem blobItem in blobs)
                    {
                        var imagename = blobItem.Name;
                        Console.WriteLine("Image Name:" + imagename);
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

                    Console.ReadKey();
                }
                else
                {
                    Console.WriteLine("Invalid blobs");
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.ReadKey();
            }
        }

        private static string Randomize(string v)
        {
            throw new NotImplementedException();
        }

        public static void GetDataLakeServiceClient(ref DataLakeServiceClient dataLakeServiceClient,
              string accountName, string accountKey)
        {
            StorageSharedKeyCredential sharedKeyCredential =
                new StorageSharedKeyCredential(accountName, accountKey);

            string dfsUri = "https://" + accountName + ".dfs.core.windows.net";

            dataLakeServiceClient = new DataLakeServiceClient
                (new Uri(dfsUri), sharedKeyCredential);
        }


        public async Task ListFilesInDirectory(DataLakeFileSystemClient fileSystemClient)
        {
            IAsyncEnumerator<PathItem> enumerator =
                fileSystemClient.GetPathsAsync("my-directory").GetAsyncEnumerator();

            await enumerator.MoveNextAsync();

            PathItem item = enumerator.Current;

            while (item != null)
            {
                Console.WriteLine(item.Name);

                if (!await enumerator.MoveNextAsync())
                {
                    break;
                }

                item = enumerator.Current;
            }

        }

    }
}
