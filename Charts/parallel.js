function makeParallel() {
    var margin = { top: 50, right: 50, bottom: 50, left: 300 },
        width = 800 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom;

    var dimensions = [
        {
            name: "College",
            scale: d3.scale.ordinal().rangePoints([0, height]),
            type: "string"
        },
        {
            name: "Citations",
            scale: d3.scale.linear().range([height, 0]),
            type: "number"
        },

        {
            name: "H-Index",
            scale: d3.scale.linear().range([height, 0]),
            type: "number"
        }
    ];

    var x = d3.scale.ordinal().domain(dimensions.map(function (d) { return d.name; })).rangePoints([0, width]),
        y = {},
        dragging = {};

    var color = d3.scale.category10();

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;

    var svg = d3.select("#pc-area").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("research_details_college.csv", function (error, data) {

        dimensions.forEach(function (dimension) {
            dimension.scale.domain(dimension.type === "number"
                ? d3.extent(data, function (d) { return +d[dimension.name]; })
                : data.map(function (d) { return d[dimension.name]; }).sort());
        });

        
        background = svg.append("g")
            .attr("class", "background")
            .selectAll("path")
            .data(data)
            .enter().append("path")
            .attr("d", path)
            .style("fill", "none");

        foreground = svg.append("g")
            .attr("class", "foreground")
            .selectAll("path")
            .data(data)
            .enter().append("path")
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", function (d) { return color(d.College) });


        var g = svg.selectAll(".dimension")
            .data(dimensions)
            .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function (d) { return "translate(" + x(d.name) + ")"; })
            .call(d3.behavior.drag()
                .origin(function (d) { return { x: x(d.name) }; })
                .on("dragstart", function (d) {
                    dragging[d.name] = x(d.name);
                    background.attr("visibility", "hidden");
                })
                .on("drag", function (d) {
                    dragging[d.name] = Math.min(width, Math.max(0, d3.event.x));
                    foreground.attr("d", path);
                    dimensions.sort(function (a, b) { return position(a) - position(b); });
                    x.domain(dimensions.map(function (d) { return d.name; }));
                    g.attr("transform", function (d) { return "translate(" + position(d) + ")"; })
                })
                .on("dragend", function (d) {
                    delete dragging[d.name];
                    transition(d3.select(this)).attr("transform", "translate(" + x(d.name) + ")");
                    transition(foreground).attr("d", path);
                    background
                        .attr("d", path)
                        .transition()
                        .delay(500)
                        .duration(0)
                        .attr("visibility", null);
                })
            );

        g.append("g")
            .attr("class", "axis")
            .each(function (d) { d3.select(this).call(axis.scale(d.scale)); })
            .append("text")
            .style("text-anchor", "middle")
            .attr("class", "axis-label")
            .attr("y", -19)
            .text(function (d) { return d.name; });

        g.append("g")
            .attr("class", "brush")
            .each(function (d) {
                d3.select(this).call(d.scale.brush = d3.svg.brush().y(d.scale).on("brushstart", brushstart).on("brush", brush));
            })
            .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16)
            .attr("fill-opacity", "0.5")
            .style("fill", "grey");
    });

    function position(d) {
        var v = dragging[d.name];
        return v == null ? x(d.name) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

    function path(d) {
        return line(dimensions.map(function (dimension) {
            var v = dragging[dimension.name];
            var tx = v == null ? x(dimension.name) : v;
            return [tx, dimension.scale(d[dimension.name])];
        }));
    }

    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
    }

    function brush() {
        var actives = dimensions.filter(function (p) { return !p.scale.brush.empty(); }),
            extents = actives.map(function (p) { return p.scale.brush.extent(); });

        foreground.style("display", function (d) {
            return actives.every(function (p, i) {
                if (p.type === "number") {
                    return extents[i][0] <= parseFloat(d[p.name]) && parseFloat(d[p.name]) <= extents[i][1];
                } else {
                    return extents[i][0] <= p.scale(d[p.name]) && p.scale(d[p.name]) <= extents[i][1];
                }
            }) ? null : "none";
        });
    }
}