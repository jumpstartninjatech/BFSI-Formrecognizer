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
        public List<int> HotelReservation { get; set; }
        public List<int> BankAccountStatement { get; set; }
        public List<int> BirthCertificate { get; set; }
        public List<int> AirTicket { get; set; }
        public List<int> Passport { get; set; }




    }
}