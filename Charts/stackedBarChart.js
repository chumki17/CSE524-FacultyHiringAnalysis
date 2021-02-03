function makeStackedBarChart() {
  d3.selectAll("svg").remove();
  d3.csv("area_gender_count.csv", function (data) {

    var margin = { top: 5, right: 160, bottom: 150, left: 30 };

    var width = 1500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var svg = d3.select("#stacked-bar-chart-area")
      .append("svg")
      .attr("width", width + margin.left + margin.right + 10)
      .attr("height", height + margin.top + margin.bottom + 10)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .style("display", "block")
      .style("margin", "auto");
    
    var dataset = d3.layout.stack()(["Male", "Female"].map(function (gender) {
      return data.map(function (d) {
        return { x: d.Area, y: +d[gender] };
      });
    }));

    var x = d3.scale.ordinal()
      .domain(dataset[0].map(function (d) { return d.x; }))
      .rangeRoundBands([10, width - 10], 0.5);

    var y = d3.scale.linear()
      .domain([0, d3.max(dataset, function (d) { return d3.max(d, function (d) { return d.y0 + d.y; }); })])
      .range([height, 0]);

    var colors = ["#1B4F72", "#F1C40F"];

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5)
      .tickSize(-width, 0, 0)
      .tickFormat(function (d) { return d });

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");


    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .style("font-size", "0.7rem")
      .attr("dx", "-.8em")
      .attr("dy", "-.2em")
      .attr("transform", "rotate(-60)");

    var grps = svg.selectAll("g.cost")
      .data(dataset)
      .enter().append("g")
      .attr("class", "cost")
      .style("fill", function (d, i) { return colors[i]; });


    var rect = grps.selectAll("rect")
      .data(function (d) { return d; })
      .enter()
      .append("rect")
      .attr("x", function (d) { return x(d.x); })
      .attr("y", function (d) { return y(d.y0 + d.y); })
      .attr("height", function (d) { return y(d.y0) - y(d.y0 + d.y); })
      .attr("width", x.rangeBand())
      .attr("colour", function (d, i) { return colors[i]; })
      .on("mouseover", function (d) {
        grps.selectAll("labels1")
          .data(function (d) { return d; })
          .enter().append("text")
          .text(function (d) {
            var temp = ((d.y0 + d.y) - d.y0);
            return temp;
          })
          .attr("class", "labels_st")
          .attr("y", function (d) { return y(d.y0) - 5; })
          .attr("x", function (d) { return x(d.x) - 20; })
          .style("fill", 'black')
          .style("padding-bottom", "1px")
          .style("font-size", "1.5 rem");
      })
      .on("mouseout", function (d) {
        d3.selectAll(".labels_st").remove();
      });


    var legend = svg.selectAll(".legend")
      .data(colors)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function (d, i) { return "translate(30," + i * 19 + ")"; });

    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function (d, i) { return colors.slice().reverse()[i]; });

    legend.append("text")
      .attr("x", width + 5)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function (d, i) {
        switch (i) {
          case 0: return "Female";
          case 1: return "Male";
        }
      });


  });
}
