// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("#scatter").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;
  
    var margin = {
      top: 20,
      bottom: 80,
      right: 40,
      left: 100
    };
  
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;

    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    // Append an SVG group
    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Initial Params
    var chosenXAxis = "age";
    var chosenYAxis = "obese";

    // function used for updating x-scale var upon click on axis label
    function xScale(acsData, chosenXAxis) {
        // create scales
        var xLinearScale = d3.scaleLinear()
        .domain([d3.min(acsData, d => d[chosenXAxis]), 
            d3.max(acsData, d => d[chosenXAxis]) 
        ])
        .range([0, width]);
    
        return xLinearScale;
    }
    // function used for updating y-scale var upon click on axis label
    function yScale(acsData, chosenYAxis) {
        // create scales
        var yLinearScale = d3.scaleLinear()
        .domain([d3.min(acsData, d => d[chosenYAxis]), 
            d3.max(acsData, d => d[chosenYAxis]) 
        ])
        .range([height,0]);
    
        return yLinearScale;
    }

    // function used for updating xAxis var upon click on axis label
    function renderXAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);
    
        xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
        return xAxis;
    }

    // function used for updating yAxis var upon click on axis label
    function renderYAxes(newYScale, yAxis) {
        var leftAxis = d3.axisLeft(newYScale);
    
        yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
        return yAxis;
    }

    // function used for updating circles group with a transition to
    // new circles
    function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {

        circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    
        return circlesGroup;
    }

    // function used for updating circles group with new tooltip
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

        var xlabel;
            
        if (chosenXAxis === "age") {
            xlabel = "Age [Median]";
        }
        else if (chosenXAxis === "poverty") {
            xlabel = "In Poverty [%]";
        }
        else {
            xlabel = "Household Income [Median]";
        }
        var ylabel;
            
        if (chosenYAxis === "obese") {
            ylabel = "Obese [%]";
        }
        else if (chosenYAxis === "smokes") {
            ylabel = "Smokes [%]";
        }
        else {
            ylabel = "Lacks Healthcare [%]";
        }

        // var toolTip = d3.tip()
        // .attr("class", "d3-tip")
        // .offset([80, -60])
        // .html(function(d) {
        //     return (`${d.rockband}<br>${xlabel} ${d[chosenXAxis]}`);
        // });
    
        // circlesGroup.call(toolTip);
    
        // circlesGroup.on("mouseover", function(data) {
        // toolTip.show(data);
        // })
        // // onmouseout event
        // .on("mouseout", function(data, index) {
        //     toolTip.hide(data);
        // });
    
        return circlesGroup;
    }
    // Retrieve data from the CSV file and execute everything below
    d3.csv("data.csv").then(function(acsData, err) {
        if (err) throw err;

        // parse data
        acsData.forEach(function(data) {
            data.poverty = +data.poverty;
            data.povertyMoe = +data.povertyMoe;
            data.age = +data.age;
            data.ageMoe = +data.ageMoe;
            data.income = +data.income;
            data.incomeMoe = +data.incomeMoe;
            data.healthcare = +data.healthcare;
            data.healthcareLow = +data.healthcareLow;
            data.healthcareHigh = +data.healthcareHigh;
            data.obesity = +data.obesity;
            data.obesityLow = +data.obesityHigh;
            data.smokes = +data.smokes;
            data.smokesLow = +data.smokesHigh;

        });
        // xLinearScale function above csv import
        var xLinearScale = xScale(acsData, chosenXAxis);
        // xLinearScale function above csv import
        var yLinearScale = yScale(acsData, chosenYAxis);

        // Create initial axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // append x axis
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        // append y axis
        chartGroup.append("g")
            .call(leftAxis);
        
        // append initial circles
        var circlesGroup = chartGroup.selectAll("circle")
        .data(acsData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 20)
        .attr("fill", "lightblue")
        .attr("opacity", ".3");

        // // Create group for two x-axis labels
        // var labelsGroup = chartGroup.append("g")
        // .attr("transform", `translate(${width / 2}, ${height + 20})`);

        // var hairLengthLabel = labelsGroup.append("text")
        // .attr("x", 0)
        // .attr("y", 20)
        // .attr("value", "hair_length") // value to grab for event listener
        // .classed("active", true)
        // .text("Hair Metal Ban Hair Length (inches)");

        // var albumsLabel = labelsGroup.append("text")
        // .attr("x", 0)
        // .attr("y", 40)
        // .attr("value", "num_albums") // value to grab for event listener
        // .classed("inactive", true)
        // .text("# of Albums Released");

    });

}

// When the browser loads, makeResponsive() is called.
makeResponsive();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", makeResponsive);