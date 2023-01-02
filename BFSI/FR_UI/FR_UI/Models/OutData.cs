using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FR_UI.Models
{
    public class AnalyzeLayoutResult
    {
        public int PageNumber { get; set; }
        public List<string> LinesText { get; set; }


    }
    public class PageResult
    {
        //public int FormatType { get; set; }
        public int statusCode { get; set; }
        public List<int> HotelDocumentPageNumber { get; set; }
        public List<int> BankBookPageNumber { get; set; }
        public List<int> BirthCertificatePageNumber { get; set; }
        public List<int> AirTicketPageNumber { get; set; }
        public List<int> NationalIdPageNumber { get; set; }




    }
}