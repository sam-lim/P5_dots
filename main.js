// Your browser will call the onload() function when the document
// has finished loading. In this case, onload() points to the
// start() method we defined below. Because of something called
// function hoisting, the start() method is callable on line 6
// even though it is defined on line 8.
window.onload = start;

// This is where all of our javascript code resides. This method
// is called by "window" when the document (everything you see on
// the screen) has finished loading.
function start() {
   
    var width = 900;
    var height = 500;


    d3.csv("movies.csv", function (csv) {
        for (var i = 0; i < csv.length; ++i) {
            csv[i].gross  = Number(csv[i].gross);
            csv[i].budget  = Number(csv[i].budget);
            csv[i].imdb_score  = Number(csv[i].imdb_score);
            csv[i].movie_title  = String(csv[i].movie_title);
            csv[i].title_year  = String(csv[i].title_year);
        }
        var grossExtent = d3.extent(csv, function (row) {
            return row.gross;
        });
        var budgetExtent = d3.extent(csv, function (row) {
            return row.budget;
        });
        var imdb_scoreExtent = d3.extent(csv, function (row) {
            return row.imdb_score;
        });
        var actExtent = d3.extent(csv, function (row) {
            return row.ACT;
        });
        var gpaExtent = d3.extent(csv, function (row) {
            return row.GPA;
        });

        var satExtents = {
            "SATM": grossExtent,
            "SATV": budgetExtent
        };


        var xScale = d3.scale.linear().domain([0, 10]).range([80, 870]);
        var yScale = d3.scale.linear().domain(budgetExtent).range([470, 30]);

        var xScale2 = d3.scale.linear().domain(actExtent).range([50, 470]);
        var yScale2 = d3.scale.linear().domain(gpaExtent).range([470, 30]);

        var xAxis = d3.svg.axis().scale(xScale);
        var yAxis = d3.svg.axis().scale(yScale);

        var xAxis2 = d3.svg.axis().scale(xScale2);
        var yAxis2 = d3.svg.axis().scale(yScale2);

        yAxis.orient("left");
        yAxis2.orient("left");


        var chart1 = d3.select("#chart1")
            .append("svg:svg")
            .attr("width", width)
            .attr("height", height);


        var chart2 = d3.select("#chart2")
            .append("svg:svg")
            .attr("width", width)
            .attr("height", height);


        /******************************************
            BRUSHING LEFT
        ******************************************/
        //// BRUSHING & LINKING
        // 1. define brush and limit its size
        var brush = d3.svg.brush()
            .extent([
                [0, 0],
                [width, height]
            ]);

        // 2. set scales for brush. 
        // we set both x- and y-axis since we are using 2D brush.
        brushX = d3.scale.linear().range([0, width]);
        brushY = d3.scale.linear().range([0, height]);
        brush.x(brushX).y(brushY);

        // 3. bind brush to DOM
        chart1.append("g")
            .attr("class", "brush")
            .call(brush);

        // 4. change brush extent style in CSS

        // 5. register brush events
        brush
            .on("brushstart", brushstart) // when mousedown&dragging starts 
            .on("brush", brushing) // when dragging
            .on("brushend", brushend); // when mouseup

        function brushstart() {
            chart1.selectAll("circle").classed("selected", false);
            chart2.select(".extent").style("display", "none");
            chart2.select(".resize").style("display", "none");
            chart1.select(".extent").style("display", null);
            chart1.select(".resize").style("display", null);
        }

        function brushing() {
            // simultaneous update during brushing
            var e = brush.extent(); // coordinates of brushed area: 
            // top-left x: e[0][0] y: e[0][1]
            // bottom-right x: e[1][0] y: e[1][1]

            // change the class of node to brushed if the node is inside the brushed extent
            var i = 0;
            var brushed_idx = [];
            chart1.selectAll('circle').each(function (d, k) {
                var selected = e[0][0] <= brushX.invert(xScale(d.imdb_score)) && brushX.invert(xScale(d.imdb_score)) <= e[1][0] &&
                    e[0][1] <= brushY.invert(yScale(d.gross)) && brushY.invert(yScale(d.gross)) <= e[1][1];
                if (selected) {
                    brushed_idx.push(k);
                }
            });

            // link to second svg- highlight nodes (that are brushed in svg1) in svg2
            i = 0;
            chart2.selectAll("circle").classed("selected2", function (d) {
                return brushed_idx.includes(i++);
            });
        }

        function brushend() {
            // update after brusing is finished
        }

        // Dots
        var temp1 = chart1.selectAll("circle")
            .data(csv)
            .enter()
            .append("circle")
            .attr("id", function (d, i) {
                return i;
            })
            .attr("stroke", "black")
            .attr("cx", function (d) {
                return xScale(d.imdb_score);
            })
            .attr("cy", function (d) {
                return yScale(d.gross);
            })
            .attr("r", 3)
            .on("click", function (d, i) {

                document.getElementById("IMDd").textContent = d.imdb_score;
                document.getElementById("budget").textContent = d.budget;
                document.getElementById("gross").textContent = d.gross;
                document.getElementById("genre").textContent = d.genres;
                
                
                d3.selectAll(".extent").style("display", "none");
                d3.selectAll(".resize").style("display", "none");
                chart1.selectAll("circle").classed("selected", false);
                chart2.selectAll("circle").classed("selected2", false);
                chart2.selectAll("circle").classed("selected", function (d, k) {
                    return i === k;
                });
            });



      



        // x-axis
        chart1 // or something else that selects the SVG element in your visualizations
            .append("g") // create a group node
            .attr("transform", "translate(0," + (height - 30) + ")")
            .call(xAxis) // call the axis generator
            .append("text")
            .attr("class", "label")
            .attr("x", width - 16)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("imdb score");
        
        // y-axis
        chart1 // or something else that selects the SVG element in your visualizations
            .append("g") // create a group node
            .attr("transform", "translate(80, 0)")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Budget");

     
    });


}
