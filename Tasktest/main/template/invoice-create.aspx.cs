using Microsoft.Ajax.Utilities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Tasktest.main.template
{
    public partial class invoice_create : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        [WebMethod()]
        public static void SaveToDb(string itemsList)
        {
            // Deserialize the JSON data into a list of objects
            var itemList = JsonConvert.DeserializeObject<List<data>>(itemsList);

            string connectionString = ConfigurationManager.ConnectionStrings["MyDbConnection"].ConnectionString;
            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    foreach (var item in itemList)
                    {
                        if (!(item.Quntity == 0))
                        {
                            Save_item(item.ItemName, item.Quntity, item.UnitPrice, connection);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static void Save_item(string itemName, int quntity, float unitPrice, SqlConnection connection)
        {
            string query = "insert into data (Item_name,Quntity,Unit_price,Total) values (@Item_name,@Quntity,@Unit_price,@Total)";

            using (SqlCommand command = new SqlCommand(query, connection))
            {
                command.Parameters.Add(new SqlParameter("@Item_name", SqlDbType.NVarChar, 100)).Value = itemName;
                command.Parameters.Add(new SqlParameter("@Quntity", SqlDbType.Int)).Value = quntity;
                command.Parameters.Add(new SqlParameter("@Unit_price", SqlDbType.Decimal)).Value = unitPrice;
                command.Parameters.Add(new SqlParameter("@Total", SqlDbType.Decimal)).Value = quntity * unitPrice;
                command.ExecuteNonQuery();
            }
        }
    }
}