// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;
    console.log("Metadata:", metadata);

    // Filter the metadata for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0]; // Assuming there is only one matching result
    console.log("Filtered Metadata for Sample:", result); 

    // Use d3 to select the panel with id of `#sample-metadata`
    const PANEL = d3.select("#sample-metadata");
    console.log("Selected Panel:", PANEL);

    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    console.log("Panel after clearing:", PANEL.html());

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      console.log(`Appended ${key.toUpperCase()}: ${value}`);  // Log each key-value pair as it's appended
    });
    
    console.log("Final Panel Content:", PANEL.html());  
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;
    console.log("Samples Data:", samples); 

    // Filter the samples for the object with the desired sample number
    let resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0]; // Assuming there is only one matching result
    console.log("Filtered Metadata for Sample:", result); 

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;
    console.log("OTU IDs:", otu_ids);  // Log the OTU IDs
    console.log("OTU Labels:", otu_labels);  // Log the OTU Labels
    console.log("Sample Values:", sample_values);  // Log the Sample Values

    // Build a Bubble Chart
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'YlGnBu'
      }
    }];

    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      margin: { t: 0 },
      hovermode: 'closest',
      xaxis: { title: 'OTU ID' },
      margin: { t: 30 }
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    var barData = [{
      y: yticks,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];

    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      margin: { t: 30, l: 150 }
    };


    // Render the Bar Chart
    Plotly.newPlot('bar', barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const names = data.names;
    console.log("Names Field:", names); 

    // Use d3 to select the dropdown with id of `#selDataset`
    let selector = d3.select("#selDataset");
    console.log("Dropdown Selector:", selector); 

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
      console.log(`Added option for sample ${sample}`);  // Log each sample added to the dropdown
    });


    // Get the first sample from the list
    let firstSample = names[0];
    console.log("First Sample:", firstSample); 

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
