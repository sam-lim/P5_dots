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
   
    var width = 1300;
    var height = 600;

    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    // Initial graph -> default year = 2010
    d3.csv("movies.csv", function(d) {
        d.budget = +d.budget; 
        d.gross = +d.gross;
        return d;
  
    }, function (csv) {
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
            
        var xScale = d3.scale.linear().domain([0, 10]).range([80, 600]);
        var yScale = d3.scale.linear().domain([0,263700000]).range([500, 30]); //[0,263700000]
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
            .attr("transform", "translate(0,500)")
            .call(xAxis) // call the axis generator
            .append("text")
            .attr("class", "label")
            .attr("x", 600)
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


            csvFilter = csv.sort(function(x, y) {return d3.descending(x.gross, y.gross);});
            csvF1 = csvFilter.filter(function (d) {return d.title_year == 2010});
            csvF = csvF1.filter(function (d) {return d.gross > csvF1[10].gross});
            var svg = chart1
            .append('svg')
            .attr('width', width)
            .attr('height', height);
    
            var bars = svg.append('g');
            xScale1 = d3.scale.linear().range([0, width/2.7]);
                yScale1 = d3.scale.ordinal().rangeRoundBands([0, height/1.25], 0.3);
                d3BarChart(csvF, bars, 1700000, xScale1, yScale1);
     
    });



    // Dropdown for years
    d3.select("select")
        .on("change", function (d) {
            var selected = d3.select("#dropdown").node().value;
            console.log(selected);

            d3.selectAll(".dot").remove();
            d3.select("svg").remove();

            d3.csv("movies.csv", function(d) {
                d.budget = +d.budget; 
                d.gross = +d.gross;
                return d;
          
            }, function (csv) {
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

                    
                var xScale = d3.scale.linear().domain([0, 10]).range([80, 600]);
                var yScale = d3.scale.linear().domain([0,263700000]).range([500, 30]); //[0,263700000]
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
                    .attr("transform", "translate(0,500)")
                    .call(xAxis) // call the axis generator
                    .append("text")
                    .attr("class", "label")
                    .attr("x", 600)
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


                    csvFilter = csv.sort(function(x, y) {return d3.descending(x.gross, y.gross);});
                    csvF1 = csvFilter.filter(function (d) {return d.title_year == selected});
                    csvF = csvF1.filter(function (d) {return d.gross > csvF1[10].gross});
                    var svg = chart1
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height);
            
                    var bars = svg.append('g');
                    xScale1 = d3.scale.linear().range([0, width/2.7]);
                        yScale1 = d3.scale.ordinal().rangeRoundBands([0, height/1.25], 0.3);
                        d3BarChart(csvF, bars, 1700000, xScale1, yScale1);
    
             
            });
    })



}
function d3BarChart(dataset, bars,topNumber, xScale, yScale) {
    
    xScale.domain([0, d3.max(dataset, function(d) {
        return d.gross })
    ]);

    yScale.domain(dataset.map(function(d) {
        return d.movie_title;
    }));


    var yAxis = d3.svg.axis().scale(yScale).orient('left');

    var xAxis = d3.svg.axis().scale(xScale).orient('top');




    bars.append('g')
        .attr('class', 'y axis')
        .attr('id','y axis')
        .attr('transform', 'translate(770, 30)')
        .call(yAxis);


    if (topNumber == 0) {
        bars.selectAll('text').remove();
    }

    ticks = bars.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(770, 30)')
        .call(xAxis)
        .selectAll(".tick text");
    ticks.attr("class", function(d,i){
            if(i%3 != 0) d3.select(this).remove();

    bars.append("text")
    .attr("class", "label")
    .attr("x", 1250)
    .attr("y", 20)
    .style("text-anchor", "end")
    .text("Gross");

    bars.append("text")
    .attr("class", "label")
    .attr("x", 750)
    .attr("y", 20)
    .style("text-anchor", "end")
    .text("Movie Title");
    });;

    bars.append('g')
        .selectAll('.bar')
        .data(dataset)
        .enter()
        // .on("mouseover", handleMouseOver)
        .append('rect')
        .attr("fill", "rgb(127, 189, 224)")
        .attr('class', 'bar')
        .attr('transform', 'translate(670,30)')
        .attr('x', 100)
        .attr('y', function(d) {
            return yScale(d.movie_title);
        })
        .attr('width', function(d) {
            return xScale(d.gross);
        })
        .attr('height', function(d) {
            return yScale1.rangeBand();
        });
    
        var PointColors = ['rgb(127, 189, 224', 'blue']
    bars.selectAll(".bar")
        .on("click", function(){
        PointColors = [PointColors[1], PointColors[0]]
        d3.select(this).style("fill", PointColors[0]);});


// bars.on("mouseover", function(d){
//     ba
// })

}
