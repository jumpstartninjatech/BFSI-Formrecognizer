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

        public static PageResult ValidateAnalyzeResult(List<AnalyzeLayoutResult> analyzeLayoutResults)
        {
            try
            {
                //List<PageResult> pageResults = new List<PageResult>();
                PageResult PR = new PageResult();
                var hotelFilter = new string[] { "hotel", "guest", "room" };
                var bankBookFilter = new string[] { "joint holder", "passbook", "transaction statement", "ifsc code", "statement" };
                var BirthCertificateFilter = new string[] { "birth certificate", "certification of birth", "child's name","certificate of birth" };
                var AirTicketFilter = new string[] { "airport", "passenger", "flight" };
                var NationalIdFilter = new string[] { "republic of india", "country code", "passport no" };
                List<int> findHotelDocumentPageNumber = new List<int>();
                List<int> findBankBookPageNumber = new List<int>();
                List<int> findBirthCertificatePageNumber = new List<int>();
                List<int> findAirTicketPageNumber = new List<int>();
                List<int> findNationalIdPageNumber = new List<int>();

                foreach (var arrayele in analyzeLayoutResults)
                {
                    string[] dataarray = arrayele.LinesText.ToArray();
                    var hotelMatches = FindMatchs(dataarray, hotelFilter);
                    if (hotelMatches.Length > 0)
                    {
                        findHotelDocumentPageNumber.Add(arrayele.PageNumber);
                    }
                    var bankBookMatches = FindMatchs(dataarray, bankBookFilter);
                    if (bankBookMatches.Length > 0)
                    {
                        findBankBookPageNumber.Add(arrayele.PageNumber);
                    }
                    var BirthCertificateMatches = FindMatchs(dataarray, BirthCertificateFilter);
                    if (BirthCertificateMatches.Length > 0)
                    {
                        findBirthCertificatePageNumber.Add(arrayele.PageNumber);
                    }
                    var AirTicketMatches = FindMatchs(dataarray, AirTicketFilter);
                    if (AirTicketMatches.Length > 0)
                    {
                        findAirTicketPageNumber.Add(arrayele.PageNumber);
                    }
                    var NationalIdMatches = FindMatchs(dataarray, NationalIdFilter);
                    if (NationalIdMatches.Length > 0)
                    {
                        findNationalIdPageNumber.Add(arrayele.PageNumber);
                    }

                }

                PR.statusCode = 200;
                PR.HotelReservation = findHotelDocumentPageNumber;
                PR.BankAccountStatement = findBankBookPageNumber;
                PR.BirthCertificate = findBirthCertificatePageNumber;
                PR.AirTicket = findAirTicketPageNumber;
                PR.Passport = findNationalIdPageNumber;
                return PR;
            }
            catch (Exception ex)
            {
                PageResult PR = new PageResult();
                PR.statusCode = 300;
                return PR;
            }


        }

        public static string[] FindMatchs(string[] array, string[] filter)
        {
            return array.Where(x => filter.Any(y => x.Contains(y))).ToArray();
        }

        //public static string[] FindMatchs(List<AnalyzeLayoutResult> array, string[] filter)
        //{
        //    return array.Where(x => filter.Any(y => x.LinesText.Contains(y))).Select(x => x.PageNumber).ToList();
        //}

    }
}