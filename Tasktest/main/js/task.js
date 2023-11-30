$(document).ready(function () {

    // delete row funciton
    $("button:contains(Delete selected rows)").click(function () {
        $('tr:has(input[type="checkbox"]:checked)').remove();
        calculateBill();
    });

    addEventOnInputs();

    var itemNumber = 4;
    $('#add_row').click(function () {
        var tableRows = $('table tbody tr:not(:last-child)');
        var lastRow = tableRows.slice(-1);
        lastRow.after(
            ` <tr>
                <td>
                    <input type="checkbox" /></td>
                <td  class="muted-text">item ${itemNumber}</td>
                <td class="muted-text">
                    <input  style="text-align: center;" value="0" type="text">
                </td>
                <td class="muted-text">
                    <input  style="text-align: center;" value="0" type="text"></td>
                <td class="text-primary"><span>0.00</span></td>
            </tr>`)
        itemNumber++;
        addEventOnInputs();
    })

 
});


function calculateBill(){
    var tableRows = $('table tbody tr:not(:last-child)');
    var netTotal = 0;
    for (let index = 0; index < tableRows.length; index++) {
        let totalElement = tableRows[index].querySelector('td span');
        let quantityAndPrice = tableRows[index].querySelectorAll('td input[type="text"]');
        totalElement.innerHTML = quantityAndPrice[0].value * quantityAndPrice[1].value; 
        netTotal +=parseFloat(totalElement.innerHTML);
    }
    $('table tbody tr:last-child td span').text(netTotal);
};

function addEventOnInputs() {
    var allInputs = $('table tbody tr td input[type="text"]');
    for (let index = 0; index < allInputs.length; index++) {
      
        $(allInputs[index]).on("keyup", calculateBill);
    }
}



function saveToDb() {
    var itemsList = [];
    var tableRows = $('table tbody tr:not(:last-child)');

    for (let i = 0; i < tableRows.length; i++) {
        let itemName = tableRows[i].cells[1].textContent;
        let quntity = tableRows[i].cells[2].querySelector("input").value;
        let unitPrice = tableRows[i].cells[3].querySelector("input").value;
        let rowObj = {
            itemName: itemName,
            quntity: quntity ,
            unitPrice: unitPrice,
            total: quntity * unitPrice
        }
        itemsList.push(rowObj);
    }

    let jsonData = JSON.stringify(itemsList);

    $.ajax({
        type: "POST",
        url: "invoice-create.aspx/SaveToDb",
        data: JSON.stringify({itemsList:jsonData}),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            console.log("Data saved to the database:", response.d);
            clearForm();
        },
        error: function (error) {
            console.error("Error:", error);
        }
    });
};

function clearForm() {
   
    var tableRows = $('table tbody tr:not(:last-child)');

    for (let i = 0; i < tableRows.length; i++) {
        tableRows[i].cells[2].querySelector("input").value = "0";
        tableRows[i].cells[3].querySelector("input").value = "0";
        tableRows[i].cells[4].querySelector("span").textContent = "0";
    }
    $('table tbody tr:last-child td span').text("0.00");
    alert("data items added successfully!");

};



