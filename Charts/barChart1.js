function makeBarChart() {
  d3.selectAll("svg").remove();
  d3.csv("area_prof_count.csv", function (data) {
    var margin = { top: 20, right: 20, bottom: 70, left: 40 },
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    var svg = d3.select("#barchart-area").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + 100 + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


    var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);
    var y = d3.scale.linear().range([height, 0]);

    x.domain(data.map(function (d) { return d.Area; }));
    y.domain([0, 165]);

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-5, 0]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(10);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.2em")
      .style("font-size", ".8rem")
      .attr("transform", "rotate(-45)");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");
    svg.call(tip);

    svg.selectAll("bar")
      .data(data)
      .enter().append("rect")
      .style("fill", "#1B4F72")
      .attr("x", function (d) { return x(d.Area); })
      .attr("width", x.rangeBand())
      .attr("y", function (d) { return y(d.Prof_Count); })
      .attr("height", function (d) { return height - y(d.Prof_Count); })
      .on("mouseover", function (d) {
        d3.select(this).style("fill", "steelblue")
          .attr("x", function (d) { return x(d.Area); })
          .attr("width", x.rangeBand())
          .attr("y", function (d) { return y(d.Prof_Count); })
          .attr("height", function (d) { return (height - y(d.Prof_Count)); })
        tip.html("<span style='color:white'>" + d.Prof_Count + "</span>");
        tip.show();
      })
      .on("mouseout", function (d) {
        d3.select(this).style("fill", '#1B4F72')
          .attr("x", function (d) { return x(d.Area); })
          .attr("width", x.rangeBand())
          .attr("y", function (d) { return y(d.Prof_Count); })
          .attr("height", function (d) { return (height - y(d.Prof_Count)); })
        tip.hide();
      });
  });
}

