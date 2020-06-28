d3.json("samples.json").then((data) => {
    var dataset = data.samples;
    var ids = dataset.map(d => d.id);

    ids.forEach(function(d) {
        d3.selectAll("#selDataset").append("option").text(d)
    });

    d3.selectAll("#selDataset").on("change", something);
    //Replot Bar Graph Based on new input
    function something () {
        var dropDown = d3.select("#selDataset");
        var selection = dropDown.property("value");
        getdata(selection);
        metadata(parseInt(selection))
    }

    function getdata(choice) {
        var filteredDataset = dataset.filter(d => d.id == choice);
        // console.log(`We are plotting data: ${filteredDataset[0]}`);

        var otuIds = filteredDataset.map(d => d.otu_ids);
        var slicedOtuIds = otuIds[0].slice(0,10)
        var otuLong = slicedOtuIds.map(d => `OTU ${d}`)

        var sampleValues = filteredDataset.map(d => d.sample_values);
        var slicedSampleValues = sampleValues[0].slice(0,10);

        var otuLabels = filteredDataset.map(d => d.otu_labels);
        var slicedOtuLabels = otuLabels.slice(0,10);
        //Bar Start
        var trace1 ={
            x:slicedSampleValues.reverse(),
            y:otuLong.reverse(),
            text:slicedOtuLabels,
            type: "bar",
            orientation: "h"
        }
        var barData = [trace1];
        var barLayout = {
            title: "Top 10 OTU_ID for OTU",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Values"},
            height: 800,
            width: 1150,
            margin: {
                l: 100,
                r: 50,
                t: 50,
                b: 150
            }
        }
        Plotly.newPlot("bar", barData, barLayout);
        //Bar End
        //Bubble Start
        var trace2 = {
            x: slicedOtuIds, 
            y: slicedSampleValues,
            text: slicedOtuLabels,
            mode: "markers",
            marker: {
                size: slicedSampleValues,
                color: slicedOtuIds,
                opacity: 0.75
            }
        };
        var bubbleData = [trace2];
        var bubbleLayout = {
            title: "Top 10 OTU_ID for OTU",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Values"},
            height: 800,
            width: 1150,
            margin: {
                l: 50,
                r: 50,
                t: 100,
                b: 100
            }
        };
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
        //Bubble End
    }
    //MetaData Start
    function metadata(choice) {
        var metaD= data.metadata
        // remove all info in demographic panel if exists
        d3.selectAll(".panel-body > h5").remove()
        // filter metadata according to chosen id
        var filteredMetadata= metaD.filter(d => d.id === choice)[0]
        // get key-value pairs and add them to the demographic info panel
        Object.entries(filteredMetadata).forEach(function([key, value]) {
            d3.selectAll(".panel-body").append("h5").html("<strong>" + key + ": " + value + "<strong>");
        });
    }
    //MetaData End
    function init() {
        getdata("940");
        metadata(940)
    };
    init();
});