(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
		var cols = [{
			id: "route",
			dataType: tableau.dataTypeEnum.string
		}, {
				id: "lat",
				dataType: tableau.dataTypeEnum.float
			}, {
				id: "lng",
				dataType: tableau.dataTypeEnum.float
			}, {
				id: "VehicleID",
				dataType: tableau.dataTypeEnum.string
			}, {
				id: "destination",
				dataType: tableau.dataTypeEnum.string
			}, {
				id: "late",
				dataType: tableau.dataTypeEnum.int
			}, {
				id: "next_stop_id",
				dataType: tableau.dataTypeEnum.int
			}, {
				id: "next_stop_name",
				dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "transitView",
            alias: "Current Septa Transitview",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("http://localhost:8889/www3.septa.org/hackathon/TransitViewAll/", function(resp) {
            var feat = resp.routes,
                tableData = [];
					 console.log(Object.keys(feat[0]));
					 let keyArr =  Object.keys(feat[0]);
					 
					 for (var g = 0, leng = keyArr.length; g < leng; g++) {
						 for (var h = 0, leng1 = feat[0][keyArr[g]].length; h < leng1; h++) {
		                   tableData.push({
									 "route": keyArr[g],
		                       "lat": feat[0][keyArr[g]][h].lat,
		                       "lng": feat[0][keyArr[g]][h].lng,
		                       "VehicleID": feat[0][keyArr[g]][h].VehicleID,
									  "destination": feat[0][keyArr[g]][h].destination,
							   "late": feat[0][keyArr[g]][h].late,
							   "next_stop_id": feat[0][keyArr[g]][h].next_stop_id,
							   "next_stop_name": feat[0][keyArr[g]][h].next_stop_name
		                   });
						 }
					 }
            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "Septa Transitview"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
