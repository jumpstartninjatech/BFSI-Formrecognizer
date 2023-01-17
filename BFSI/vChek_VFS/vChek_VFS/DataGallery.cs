using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace vChek_VFS
{
    class DataHandler
    {
        public static String Connstring()
        {
            string connStr = "Database=vchek_database_staging_v4;Data Source=vinspktserver.mysql.database.azure.com; User Id=vInspktAdmin@vinspktserver;Password=Admin@123";
            return connStr;
        }

        public static string InsertDocumentExtractionDetails(string filename)
        {
            var status_code = "";
            string query = "SELECT COUNT(id) AS id_count FROM vchek_activity_results WHERE ObjectIDValue = '"+ filename + "';";
            MySqlCommand cmd = new MySqlCommand(query, new MySqlConnection(Connstring()));
            try
            {
                cmd.Connection.Open();
                MySqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                dr.Read();

                int count = Convert.ToInt32(dr["id_count"]);
                if (count >= 1)
                {
                    dr.Close();
                    status_code = "100";
                }
                else
                {
                    dr.Close();
                    status_code = "200";
                }
                return status_code;
            }
            finally
            {
                cmd.Connection.Close();
            }

        }

    }
}
