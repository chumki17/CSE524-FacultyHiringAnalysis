function makeLollipopChart() {
    data = [{
        Category: "C1",
        Citations: 9496,
        HIndex: 41
    }, {
        Category: "C2",
        Citations: 7126,
        HIndex: 37
    }, {
        Category: "C3",
        Citations: 5124,
        HIndex: 31
    }, {
        Category: "C4",
        Citations: 4507,
        HIndex: 31
    }, {
        Category: "C5",
        Citations: 3335,
        HIndex: 26
    }]

    var width = 600;
    var height = 300;

    var x = d3.scale.linear()
        .range([0, width])

    var y = d3.scale.ordinal()
        .rangeRoundBands([0, height], .1);

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0]);

    var svg = d3.select("#lollipop-chart-area").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(50,40)");

    svg.call(tip);


    x.domain([-100, 9500])
    y.domain(data.map(function (d) {
        return d.Category;
    }));

    svg.selectAll(".bar")
        .data(data)
        .enter().append("line")
        .attr("class", "bar")
        .attr("x1", function (d) {
            return x(Math.min(0, d.Citations));
        })
        .attr("y1", function (d) {
            return y(d.Category);
        })
        .attr("x2", function (d) {
            return Math.abs(x(d.Citations) - x(0));
        })
        .attr("y2", function (d) {
            return y(d.Category);
        })
        .attr("stroke", "#F1C40F")
        .attr("stroke-width", "8px")
        .on("mouseover", function (d) {
            tip.html("<span style='color:white'>" + "Citations: " + d.Citations + "</span>");
            tip.show();
        })
        .on("mouseout", function (d) {
            tip.hide();
        });

    svg.selectAll(".bar2")
        .data(data)
        .enter().append("line")
        .attr("class", "bar2")
        .attr("x1", function (d) {
            return x(Math.min(0, -d.HIndex * 10));
        })
        .attr("y1", function (d) {
            return y(d.Category);
        })
        .attr("x2", function (d) {
            return Math.abs(x(-d.HIndex * 10) - x(0));
        })
        .attr("y2", function (d) {
            return y(d.Category);
        })
        .attr("stroke", "#1B4F72")
        .attr("stroke-width", "8px")
        .on("mouseover", function (d) {
            tip.html("<span style='color:white'>" + "H-Index: " + d.HIndex + "</span>");
            tip.show();
        })
        .on("mouseout", function (d) {
            tip.hide();
        });

    svg.selectAll("circle1")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return Math.abs(x(d.Citations) - x(0)); })
        .attr("cy", function (d) { return y(d.Category); })
        .attr("r", "8")
        .style("fill", "#F1C40F")
        .on("mouseover", function (d) {
            tip.html("<span style='color:white'>" + "Citations: " + d.Citations + "</span>");
            tip.show();
        })
        .on("mouseout", function (d) {
            tip.hide();
        });

    svg.selectAll("circle2")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(Math.min(0, -d.HIndex * 10)); })
        .attr("cy", function (d) { return y(d.Category); })
        .attr("r", "8")
        .style("fill", "#1B4F72")
        .on("mouseover", function (d) {
            tip.html("<span style='color:white'>" + "H-Index: " + d.HIndex + "</span>");
            tip.show();
        })
        .on("mouseout", function (d) {
            tip.hide();
        });

    svg.selectAll("labels")
        .data(data)
        .enter()
        .append("text")
        .attr("x", function (d) { return -50; })
        .attr("y", function (d) { return y(d.Category); })
        .text(function (d) { return d.Category; })
        .attr("font-family", "sans-serif")
        .attr("font-size", "40px")
        .attr("font-weight", "bold")
        .attr("fill", "black");

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .append("line")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y2", height);

}