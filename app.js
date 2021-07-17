var svgArea = d3.select("#scatter").select("svg");

// SVG wrapper dimensions are determined by the current width and
// height of the browser window.
var svgWidth = 960;
var svgHeight = 500;

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

// Import Data
d3.csv("data.csv").then(function(acsData)   {
    // Step 1: Parse Data/Cast as numbers
// ==============================
    acsData.forEach(function(data) {
        data.smokes = +data.smokes;
        data.healthcare = +data.healthcare;
        });
    
    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
        .domain([0, d3.max(acsData, d => d.smokes)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(acsData, d => d.healthcare)])
        .range([height, 0]);
    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    // Initialize tooltip 
    var toolTip = d3
        .tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(data) {
            var stateName = data.abbr;
            var smoker = +data.smokes;
            var healthcare = +data.healthcare;
            return (
                stateName 
            );
        });
    // Create tooltip
    chartGroup.call(toolTip);
    
    // Step 5: Create Circles
    // ==============================
    chartGroup.selectAll("circle")
        .data(acsData)
        .enter()
        .append("circle")
        .attr("cx", function(data) {
            return xLinearScale(data.smokes)
        })
        .attr("cy", function(data) {
            return yLinearScale(data.healthcare)
        })
        .attr("r", "15")
        .attr("fill", "pink")
        .attr("opacity", ".5");

    chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .selectAll("tspan")
        .data(acsData)
        .enter()
        .append("tspan")
            .attr("x", function(data) {
                return xLinearScale(data.smokes);
            })
            .attr("y", function(data) {
                return yLinearScale(data.healthcare);
            })
            .text(function(data) {
                return data.abbr
            });
    // Append y-axis label
    chartGroup
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.left + 70)
        .attr("x", 0 - height/2.3)
        .text("Smokes (%)")

    // Append x-axis labels
    chartGroup
        .append("text")
        .attr(
            "transform",
            "translate(" + width / 2.2 + " ," + (height + margin.top + 20) + ")"
        )
        .text("Healthcare (%)");
    
    
    


});
