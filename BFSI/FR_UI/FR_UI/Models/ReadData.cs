using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading;
using System.Web;

namespace FR_UI.Models
{
    public class ReadData
    {

        public static string jsonString = null, Error = null;
        public static dynamic JSONresult, result;
        public string CompleteString = "";

        public static List<AnalyzeLayoutResult> ALR = new List<AnalyzeLayoutResult>();


        public static string OcrApiEndpoint = ConfigurationManager.AppSettings["FREndpoint"];
        public static string OcrApiKey = ConfigurationManager.AppSettings["FRApiKey"];
        public static void ExtractText(string imageData)
        {
            try
            {

                ALR = new List<AnalyzeLayoutResult>();

                if (imageData != null)
                {

                    var client = new RestClient(OcrApiEndpoint);
                    client.Timeout = -1;
                    var request = new RestRequest(Method.POST);
                    request.AddHeader("Content-Type", " application/octet-stream");
                    request.AddHeader("Ocp-Apim-Subscription-Key", OcrApiKey);
                    request.AddParameter(" application/octet-stream", Convert.FromBase64String(imageData), ParameterType.RequestBody);
                    IRestResponse response = client.Execute(request);
                    Console.WriteLine(response.Content);
                    result = JsonConvert.DeserializeObject(response.Content);
                    if ((int)response.StatusCode == 202)
                    {
                        if (response.Headers.Count > 0)
                        {
                            string operationLocation = response.Headers.ToList().Find(x => x.Name == "Operation-Location").Value.ToString();
                            var client1 = new RestClient(operationLocation);
                            client1.Timeout = -1;
                            var request1 = new RestRequest(Method.GET);
                            request1.AddHeader("Ocp-Apim-Subscription-Key", OcrApiKey);
                            IRestResponse response1;
                            do
                            {
                                Thread.Sleep(5000);
                                response1 = client1.Execute(request1);
                                JSONresult = JsonConvert.DeserializeObject(response1.Content);
                            } while ((int)response1.StatusCode == 200 && JSONresult.status != "succeeded" && JSONresult.status != "failed");
                            if ((int)response1.StatusCode == 200 && JSONresult.status == "succeeded")
                            {
                                jsonString = JsonConvert.SerializeObject(JSONresult);
                                var readResult = JSONresult.analyzeResult.readResults;


                                for (var i = 0; i < readResult.Count; i++)
                                {
                                    var pageNumber = JSONresult.analyzeResult.readResults[i].page;
                                    var readResultPage = JSONresult.analyzeResult.readResults[i];

                                    List<string> RTList = new List<string>();
                                    for (var j = 0; j < readResultPage.lines.Count; j++)
                                    {
                                        RTList.Add(readResultPage.lines[j].text.ToString().ToLower());

                                    }
                                    ALR.Add(new AnalyzeLayoutResult
                                    {
                                        PageNumber = pageNumber,
                                        LinesText = RTList

                                    });

                                }
                                //  ["readResults"]["lines"]["text"]

                            }

                            else if (JSONresult.status == "failed")
                            {

                            }
                            else
                            {

                            }
                        }
                        else
                        {

                        }
                    }
                }

            }
            catch (Exception ex)
            {

            }
        }

        public static List<PageResult> ValidateAnalyzeResult(List<AnalyzeLayoutResult> analyzeLayoutResults)
        {

            List<PageResult> pageResults = new List<PageResult>();
            var filter = new string[] { "hotel", "guest", "room" };
            //var matches = FindMatchs(analyzeLayoutResults, filter);


            var findHotelDocumentPageNumber = analyzeLayoutResults.Where(x => filter.Any(y => x.LinesText.Contains(y))).Select(x => x.PageNumber).ToList();
            var findBankBookPageNumber = analyzeLayoutResults.Where(s => s.LinesText.Contains("bank") || s.LinesText.Contains("customer")|| s.LinesText.Contains("joint holder")).Select(s => s.PageNumber).ToList();
            var findBirthCertificatePageNumber = analyzeLayoutResults.Where(s => s.LinesText.Contains("birth certificate") || s.LinesText.Contains("certification of birth")).Select(s => s.PageNumber).ToList();
            var findAirTicketPageNumber = analyzeLayoutResults.Where(s => s.LinesText.Contains("economy") || s.LinesText.Contains("airport") || s.LinesText.Contains("passenger")).Select(s => s.PageNumber).ToList();
            var findNationalIdPageNumber = analyzeLayoutResults.Where(s => s.LinesText.Contains("passport")|| s.LinesText.Contains("republic of india")).Select(s => s.PageNumber).ToList();

            pageResults.Add(new PageResult
            {
                FormatType = 0,
                HotelDocumentPageNumber = findHotelDocumentPageNumber,
                BankBookPageNumber = findBankBookPageNumber,
                BirthCertificatePageNumber = findBirthCertificatePageNumber,
                AirTicketPageNumber = findAirTicketPageNumber,
                NationalIdPageNumber = findNationalIdPageNumber
            });

            pageResults.Add(new PageResult
            {
                FormatType = 1,
                HotelDocumentPageNumber = findHotelDocumentPageNumber
            }); 
            pageResults.Add(new PageResult
            {
                FormatType = 2,
                BankBookPageNumber = findBankBookPageNumber
            });
            pageResults.Add(new PageResult
            {
                FormatType = 3,
                BirthCertificatePageNumber = findBirthCertificatePageNumber
            });
            pageResults.Add(new PageResult
            {
                FormatType = 4,
                AirTicketPageNumber = findAirTicketPageNumber
            }); 
            pageResults.Add(new PageResult
            {
                FormatType = 5,
                NationalIdPageNumber = findNationalIdPageNumber
            });


            return pageResults;

        }

        //public static string[] FindMatchs(List<AnalyzeLayoutResult> array, string[] filter)
        //{
        //    return array.Where(x => filter.Any(y => x.LinesText.Contains(y))).Select(x => x.PageNumber).ToList();
        //}

    }
}