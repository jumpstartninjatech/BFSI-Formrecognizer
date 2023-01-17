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

namespace vChek_VFS_Global_DocumentClassification
{
    class Program
    {
        //static string BlobStorage_Key = "Tvvve3hN7q3uNOXaQl82V26MSTPEW+qOeSdQEFcUKwBeOG7PCrhUMnWA4yI1XX3XlardqK/yhsNc+ASteTtozA==";
        //static string BlobStorage_AccName = "bfsidocumentcontainer";
        //static string BlobStorageContainerName = "validationimage";
        //static string BlobconnectionString = "DefaultEndpointsProtocol=https;AccountName=bfsidocumentcontainer;AccountKey=Tvvve3hN7q3uNOXaQl82V26MSTPEW+qOeSdQEFcUKwBeOG7PCrhUMnWA4yI1XX3XlardqK/yhsNc+ASteTtozA==;EndpointSuffix=core.windows.net";
        public static dynamic JSONresult;
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
               // Console.WriteLine("Tiff File process starts");
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
                   // Console.WriteLine("File Name: " + pathItem.Name);
                    String[] spearator = { "." };
                    // using the method
                    Console.WriteLine("*****************************************************");
                    Console.WriteLine("Fetching the file "+ pathItem.Name + " from data lake....");
                    Console.WriteLine("Document classification & seggragagtion starting for " + pathItem.Name+" ...");
                    Console.WriteLine("Processing " + pathItem.Name + " This may take a while depending on the document size and document types found.Please hang on...");

                    SpinAnimation.Start(20);
                    String[] strlist = pathItem.Name.Split(spearator, StringSplitOptions.RemoveEmptyEntries);
                    string filename = strlist[0];
                    byte[] imagebytedata = await DownloadFile(filesystem, BlobStorageContainerName, pathItem.Name);
                    var client = new RestClient("https://bfsidocumentprocess.azurewebsites.net/GetTiffExtraction");
                    client.Timeout = -1;
                    var request = new RestRequest(Method.POST);
                    request.AddHeader("filename", filename);
                    request.AddHeader("GUID", "e2e5f02b-a67d-416d-a4ab-091172ee3207");
                    request.AddHeader("Content-Type", "application/octet-stream");
                    request.AddParameter("application/octet-stream", imagebytedata, ParameterType.RequestBody);
                    IRestResponse response = client.Execute(request);
                    SpinAnimation.Stop();
                    Console.WriteLine("*****************************************************");
                   // Console.WriteLine(response.Content);
                    JSONresult = JsonConvert.DeserializeObject(response.Content);
                    string getstringHotelReservation = getpageDetails(JSONresult.Result.HotelReservation);
                    string getstringBankAccountStatement = getpageDetails(JSONresult.Result.BankAccountStatement);
                    string getstringBirthCertificate = getpageDetails(JSONresult.Result.BirthCertificate);
                    string getstringAirTicket = getpageDetails(JSONresult.Result.AirTicket);
                    string getstringPassport = getpageDetails(JSONresult.Result.Passport);

                    Console.WriteLine("Document Segreggation completed for " + pathItem.Name);
                    Console.WriteLine("1.Hotel Reservation found at page " + getstringHotelReservation);
                    Console.WriteLine("2.Air Ticket found at page " + getstringAirTicket);
                    Console.WriteLine("3.Birth Certificate found at page " + getstringBirthCertificate);
                    Console.WriteLine("4.Passport found at page " + getstringPassport);
                    Console.WriteLine("5.Bank Account found at page " + getstringBankAccountStatement);
                    Console.WriteLine("*****************************************************");

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

        public static string getpageDetails(dynamic pagedata)
        {
            string pagelistData = "";
            int totalCount = pagedata.Count;
            for (int count = 0; count < totalCount; count++)
            {
                if (count == 0)
                {
                    pagelistData += pagedata[count];
                }
                else
                {
                    if ((count + 1) == totalCount)
                    {
                        pagelistData += " and "+ pagedata[count];
                    }
                    else
                    {
                        pagelistData += ","+pagedata[count];
                    }
                }
            }
            return pagelistData;
        }

        public static class SpinAnimation
        {
            //spinner background thread

            private static System.ComponentModel.BackgroundWorker spinner = initialiseBackgroundWorker();

            //starting position of spinner changes to current position on start

            private static int spinnerPosition = 25;

            //pause time in milliseconds between each character in the spin animation

            private static int spinWait = 25;

            //field and property to inform client if spinner is currently running

            private static bool isRunning;

            public static bool IsRunning { get { return isRunning; } }



            /// <summary>

            /// Worker thread factory

            /// </summary>

            /// <returns>background worker thread</returns>



            private static System.ComponentModel.BackgroundWorker initialiseBackgroundWorker()

            {



                System.ComponentModel.BackgroundWorker obj = new System.ComponentModel.BackgroundWorker();

                //allow cancellation to be able to stop the spinner

                obj.WorkerSupportsCancellation = true;

                //anonymous method for background thread's DoWork event

                obj.DoWork += delegate

                {

                    //set the spinner position to the current console position

                    spinnerPosition = Console.CursorLeft;

                    //run animation unless a cancellation is pending

                    while (!obj.CancellationPending)

                    {

                        //characters to iterate through during animation

                        char[] spinChars = new char[] { '|', '/', '-', '\\' };

                        //iterate through animation character array

                        foreach (char spinChar in spinChars)

                        {

                            //reset the cursor position to the spinner position

                            Console.CursorLeft = spinnerPosition;

                            //write the current character to the console

                            Console.Write("Processing "+spinChar+ spinChar+ spinChar+ spinChar + spinChar + spinChar + spinChar + spinChar + spinChar + spinChar + spinChar + spinChar + spinChar + spinChar + spinChar + spinChar + spinChar + spinChar);
                            

                            //pause for smooth animation - set by the start method

                            System.Threading.Thread.Sleep(spinWait);

                        }

                    }

                };

                return obj;

            }



            /// <summary>

            /// Start the animation

            /// </summary>

            /// <param name="spinWait">wait time between spin steps in milliseconds</param>

            public static void Start(int spinWait)

            {

                //Set the running flag

                isRunning = true;

                //process spinwait value

                SpinAnimation.spinWait = spinWait;

                //start the animation unless already started

                if (!spinner.IsBusy)

                    spinner.RunWorkerAsync();

                else throw new InvalidOperationException("Cannot start spinner whilst spinner is already running");

            }



            /// <summary>

            /// Overloaded Start method with default wait value

            /// </summary>

            public static void Start() { Start(25); }

            /// <summary>

            /// Stop the spin animation

            /// </summary>



            public static void Stop()

            {

                //Stop the animation

                spinner.CancelAsync();

                //wait for cancellation to complete

                while (spinner.IsBusy) System.Threading.Thread.Sleep(100);

                //reset the cursor position

                Console.CursorLeft = spinnerPosition;

                //set the running flag

                isRunning = false;

            }

        }

    }
}
