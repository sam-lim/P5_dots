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
   
    var width = 1500;
    var height = 650;

    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    // Initial graph -> default year = 2010
    d3.csv("movies.csv", function (csv) {
        for (var i = 0; i < csv.length; ++i) {
            csv[i].gross  = Number(csv[i].gross);
            csv[i].budget  = Number(csv[i].budget);
            csv[i].imdb_score  = Number(csv[i].imdb_score);
            csv[i].movie_title  = String(csv[i].movie_title);
            csv[i].title_year  = String(csv[i].title_year);
            csv[i].movie_imdb_link  = String(csv[i].movie_imdb_link);
        }
        var grossExtent = d3.extent(csv, function (row) {
            return row.gross;
        });
        var budgetExtent = d3.extent(csv, function (row) {
            return row.budget;
        });
            
        var xScale = d3.scale.linear().domain([0, 10]).range([80, 750]);
        var yScale = d3.scale.linear().domain([0,263700000]).range([600, 30]); //[0,263700000]
        var rScale = d3.scale.linear().domain(grossExtent).range([3, 60]);


        var xAxis = d3.svg.axis().scale(xScale);
        var yAxis = d3.svg.axis().scale(yScale);
        yAxis.orient("left");

        // Dot plot
        var chart1 = d3.select("#chart1")
            .append("svg:svg")
            .attr("width", width)
            .attr("height", height);
        
            // var tooltip = d3.select("details")
            // .append("div")
            // .style("position", "absolute")
            // .style("z-index", "10")
            // .style("visibility", "hidden")
            // .text("a simple tooltip");

        // Dots
        var temp1 = chart1.selectAll("circle")
            .data(csv)
            .enter()
            .append("circle")
            .attr('class', 'dot')
            .attr("id", function (d, i) {
                return i;
            })
            .attr("stroke", "black")
            .attr("fill", "pink")
            .filter(function (d) {return d.title_year == 2010 }) //170051787
            //.attr("class", "moreGross")
            .attr("cx", function (d) {
                return xScale(d.imdb_score);
            })
            .attr("cy", function (d) {
                return yScale(d.budget);
            })
            .attr("r", function(d) {
                return rScale(d.gross);
            })
            // .on("mouseover", function(d) {
            //     return tooltip.style("visibility", "visible").text('radius = ' + d);
            //   })
            // .on("mouseout", function() {
            //     return tooltip.style("visibility", "hidden");
            //  })
        //     .on("mouseover", function(d)
        //     {
        //         d3.select(d.budget).style("visibility","visible")
        //     })
        //    .on("mouseout", function(d)
        //     {
        //         d3.select(d.budget).style("visibility","hidden")
        //     })
            .on("mouseover", function(d) {		
                 div.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                div.html("Title:" + d.movie_title+ "<br/>"  
                    + "Director: " + d.director_name+ "<br/>" 
                    + "IMDb Score: " + d.imdb_score+ "<br/>" 
                    + "Budget: $" + d.budget+ "<br/>" 
                    + "Gross:  $" + d.gross+ "<br/>" 
                    + "Genres: " + d.genres+ "<br/>" 
                )	
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");	
                })					
            .on("mouseout", function(d) {		
                div.transition()		
                    .duration(500)		
                    .style("opacity", 0)	})
            .on("click", function (d, i) {
                document.getElementById("title").textContent = d.movie_title;
                document.getElementById("director").textContent = d.director_name;
                document.getElementById("IMDd").textContent = d.imdb_score;
                document.getElementById("budget").textContent = "$ "+d.budget;
                document.getElementById("gross").textContent =  "$ "+d.gross;
                document.getElementById("genre").textContent = d.genres;
            
            });

            chart1.selectAll('.dot')
                .filter(function (d) {
                    return d.gross >= d.budget; })
                .attr("class", "moreGross");
                
        // x-axis
        chart1 // or something else that selects the SVG element in your visualizations
            .append("g") // create a group node
            .attr("transform", "translate(0,600)")
            .call(xAxis) // call the axis generator
            .append("text")
            .attr("class", "label")
            .attr("x", 740)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("IMDb score");
        
        // y-axis
        chart1 // or something else that selects the SVG element in your visualizations
            .append("g") // create a group node
            .attr("transform", "translate(80, 0)")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("x", -30)
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Budget");
     
    });

    // d3.select(graph)
    //     .append('p')
    //     .append('button')
    //     .text('Filter Data')
    //     .on('click', function () {

    //     })

    // Dropdown for years
    d3.select("select")
        .on("change", function (d) {
            var selected = d3.select("#dropdown").node().value;
            console.log(selected);

            d3.selectAll(".dot").remove();
            d3.select("svg").remove();

            d3.csv("movies.csv", function (csv) {
                for (var i = 0; i < csv.length; ++i) {
                    csv[i].gross  = Number(csv[i].gross);
                    csv[i].budget  = Number(csv[i].budget);
                    csv[i].imdb_score  = Number(csv[i].imdb_score);
                    csv[i].movie_title  = String(csv[i].movie_title);
                    csv[i].title_year  = String(csv[i].title_year);
                    csv[i].movie_imdb_link  = String(csv[i].movie_imdb_link);
                }
                var grossExtent = d3.extent(csv, function (row) { return row.gross; });
                var budgetExtent = d3.extent(csv, function (row) { return row.budget; });

                    
                var xScale = d3.scale.linear().domain([0, 10]).range([80, 750]);
                var yScale = d3.scale.linear().domain([0,263700000]).range([600, 30]); //[0,263700000]
                var rScale = d3.scale.linear().domain(grossExtent).range([3, 60]);


                var xAxis = d3.svg.axis().scale(xScale);
                var yAxis = d3.svg.axis().scale(yScale);
                yAxis.orient("left");

                // Dot plot
                var chart1 = d3.select("#chart1")
                .append("svg:svg")
                .attr("width", width)
                .attr("height", height);

                // Dots
                var temp1 = chart1.selectAll("circle")
                    .data(csv)
                    .enter()
                    .append("circle")
                    .attr("class",'dot')
                    .attr("id", function (d, i) {
                        return i;
                    })
                    .attr("stroke", "black")
                    .attr("fill", "pink")
                    .filter(function (d) {return d.title_year == selected }) //170051787
                    //.attr("class", "moreGross")
                    .attr("cx", function (d) {
                        return xScale(d.imdb_score);
                    })
                    .attr("cy", function (d) {
                        return yScale(d.budget);
                    })
                    .attr("r", function(d) {
                        return rScale(d.gross);
                    })
                    .on("mouseover", function(d) {		
                        div.transition()		
                           .duration(200)		
                           .style("opacity", .9);		
                       div.html("Title:" + d.movie_title+ "<br/>"  
                           + "Director: " + d.director_name+ "<br/>" 
                           + "IMDb Score: " + d.imdb_score+ "<br/>" 
                           + "Budget: $" + d.budget+ "<br/>" 
                           + "Gross:  $" + d.gross+ "<br/>" 
                           + "Genres: " + d.genres+ "<br/>" 
                       )	
                           .style("left", (d3.event.pageX) + "px")		
                           .style("top", (d3.event.pageY - 28) + "px");	
                       })					
                   .on("mouseout", function(d) {		
                       div.transition()		
                           .duration(500)		
                           .style("opacity", 0)	})
                    .on("click", function (d, i) {
                        document.getElementById("title").textContent = d.movie_title;
                        document.getElementById("director").textContent = d.director_name;
                        document.getElementById("IMDd").textContent = d.imdb_score;
                        document.getElementById("budget").textContent = "$ "+d.budget;
                        document.getElementById("gross").textContent =  "$ "+d.gross;
                        document.getElementById("genre").textContent = d.genres;
                    });

                
                chart1.selectAll('.dot')
                .filter(function (d) {
                        return d.gross >= d.budget; })
                .attr("class", "moreGross");
            
                // x-axis
                chart1 // or something else that selects the SVG element in your visualizations
                    .append("g") // create a group node
                    .attr("transform", "translate(0,600)")
                    .call(xAxis) // call the axis generator
                    .append("text")
                    .attr("class", "label")
                    .attr("x", width - 16)
                    .attr("y", -6)
                    .style("text-anchor", "end")
                    .text("IMDb score");
                
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
    })



}
