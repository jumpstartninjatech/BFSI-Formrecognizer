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
using System.IO;
using Azure;

namespace BFSI_datalakedemo
{
    class Program
    {
        //static string BlobStorage_Key = "Tvvve3hN7q3uNOXaQl82V26MSTPEW+qOeSdQEFcUKwBeOG7PCrhUMnWA4yI1XX3XlardqK/yhsNc+ASteTtozA==";
        //static string BlobStorage_AccName = "bfsidocumentcontainer";
        //static string BlobStorageContainerName = "validationimage";
        //static string BlobconnectionString = "DefaultEndpointsProtocol=https;AccountName=bfsidocumentcontainer;AccountKey=Tvvve3hN7q3uNOXaQl82V26MSTPEW+qOeSdQEFcUKwBeOG7PCrhUMnWA4yI1XX3XlardqK/yhsNc+ASteTtozA==;EndpointSuffix=core.windows.net";

        static string BlobStorage_Key = "3nikEUUEy+iLeuHKLGlWEED7cItbxCoWDlhwHuMZvj9CyqaWjJD0eqDLv8COu3+RniypuHxwsJDS+AStQdJDFA==";
        static string BlobStorage_AccName = "bfsidatalakegen";
        static string BlobStorageContainerName = "source";
        static string BlobconnectionString = "DefaultEndpointsProtocol=https;AccountName=bfsidatalakegen;AccountKey=PkgnfsDywAJmBF8XKsIJQTFRs1SLbiUagZFhL+p5R1NmcikGBC5kxp5pQfxiGSvTuhWFvrJDNhgx+AStAgLiJg==;EndpointSuffix=core.windows.net";

        public static object blobItem { get; set; }
        public static object blobs { get; set; }
        static async Task Main(string[] args)
        {
            try
            {
                Console.WriteLine("Tiff File process starts");
                List<string> names = new List<string>();
                // Uri serviceUri = new Uri("https://" + BlobStorage_AccName + ".dfs.core.windows.net");
                Uri serviceUri = new Uri("https://bfsidatalakegen.blob.core.windows.net");
                StorageSharedKeyCredential sharedKeyCredential = new StorageSharedKeyCredential(BlobStorage_AccName, BlobStorage_Key);
                // Create DataLakeServiceClient using StorageSharedKeyCredentials
                DataLakeServiceClient serviceClient = new DataLakeServiceClient(serviceUri, sharedKeyCredential);
                // Create a DataLake Filesystem
                DataLakeFileSystemClient filesystem = serviceClient.GetFileSystemClient(BlobStorageContainerName);

                foreach (PathItem pathItem in filesystem.GetPaths())
                {
                    names.Add(pathItem.Name);
                    Console.WriteLine("File Name: "+ pathItem.Name);
                    String[] spearator = {"."};
                    // using the method
                    String[] strlist = pathItem.Name.Split(spearator,StringSplitOptions.RemoveEmptyEntries);
                    string filename = strlist[0];
                    byte[] imagebytedata =  await DownloadFile(filesystem, BlobStorageContainerName, pathItem.Name);

                    var client = new RestClient("https://bfsidocumentprocess.azurewebsites.net/GetTiffExtraction");
                    client.Timeout = -1;
                    var request = new RestRequest(Method.POST);
                    request.AddHeader("filename", filename);
                    request.AddHeader("GUID", "e2e5f02b-a67d-416d-a4ab-091172ee3207");
                    request.AddHeader("Content-Type", "application/octet-stream");
                    request.AddParameter("application/octet-stream", imagebytedata, ParameterType.RequestBody);
                    IRestResponse response = client.Execute(request);
                    Console.WriteLine(response.Content);
                }
                Console.ReadKey();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                Console.ReadKey();
            }
        }

        public static async Task<byte[]> DownloadFile(DataLakeFileSystemClient fileSystemClient, string containername, string filename)
        {
                DataLakeFileClient fileClient = fileSystemClient.GetFileClient(filename);

                Response<FileDownloadInfo> downloadResponse = await fileClient.ReadAsync();

                BinaryReader reader = new BinaryReader(downloadResponse.Value.Content);

                byte[] bydataTiff = ReadAllBytes(reader);

                return bydataTiff;
        }

        public static byte[] ReadAllBytes(BinaryReader reader)
        {
            const int bufferSize = 4096;
            using (var ms = new MemoryStream())
            {
                byte[] buffer = new byte[bufferSize];
                int count;
                while ((count = reader.Read(buffer, 0, buffer.Length)) != 0)
                    ms.Write(buffer, 0, count);
                return ms.ToArray();
            }

        }

    }
}
