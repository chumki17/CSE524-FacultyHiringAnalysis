function makeLineChart() {

	d3.selectAll("svg").remove();
	d3.csv("us_non_us_profs.csv", function (data) {
		console.log(data);

		var margin = { top: 30, right: 50, bottom: 30, left: 50 },
			width = 700 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		var x = d3.scale.ordinal().rangePoints([0, width]);
		var y = d3.scale.linear().range([height, 0]);

		var xAxis = d3.svg.axis().scale(x)
			.orient("bottom").ticks(4);

		var yAxis = d3.svg.axis().scale(y)
			.orient("left").ticks(10);

		var vals = d3.svg.line()
			.x(function (d) { return x(d.Degree); })
			.y(function (d) { return y(d.USA); });

		var vals2 = d3.svg.line()
			.x(function (d) { return x(d.Degree); })
			.y(function (d) { return y(d.Non_USA); });

		var svg = d3.select("#line-chart-area")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		
		x.domain(data.map(function (d) { return d.Degree; }));
		// x.domain(['BS', 'MS', 'Phd', 'PostDoc']);
		y.domain([0, d3.max(data, function (d) { return Math.max(d.USA, d.Non_USA); })]);

		svg.selectAll("labels1")
			.data(data)
			.enter()
			.append("text")
			.attr("x", function (d) { return x(d.Degree); })
			.attr("y", function (d) { return y(d.USA) - 10; })
			.text(function (d) { return d.USA; })
			.attr("font-family", "sans-serif")
			.attr("font-size", "1 rem")
			.attr("font-weight", "bold")
			.attr("fill", "black");

		svg.selectAll("labels2")
			.data(data)
			.enter()
			.append("text")
			.attr("x", function (d) { return x(d.Degree); })
			.attr("y", function (d) { return y(d.Non_USA) - 10; })
			.text(function (d) { return d.Non_USA; })
			.attr("font-family", "sans-serif")
			.attr("font-size", "1 rem")
			.attr("font-weight", "bold")
			.attr("fill", "black");

		svg.append("path")	
			.attr("class", "line")
			.style("stroke", "#1B4F72")
			.style("stroke-width", "2px")
			.style("fill", "none")
			.attr("d", vals(data));

		svg.append("path")
			.attr("class", "line")
			.style("stroke", "green")
			.style("stroke-width", "2px")
			.style("fill", "none")
			.attr("d", vals2(data));

		svg.append("g")			
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		svg.append("g")	
			.attr("class", "y axis")
			.call(yAxis);

		svg.append("rect")
			.attr("x", width + 10)
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", "#1B4F72")
			.text("USA");

		svg.append("text")
			.attr("x", width + 30)
			.attr("y", 9)
			.attr("dy", ".35em")
			.style("font-weight", "bold")
			.style("text-anchor", "start")
			.text("USA");

		svg.append("rect")
			.attr("x", width + 10)
			.attr("y", 30)
			.attr("width", 18)
			.attr("height", 18)
			.style("fill", "green")
			.text("Non USA");

		svg.append("text")
			.attr("x", width + 30)
			.attr("y", 40)
			.attr("dy", ".35em")
			.style("font-weight", "bold")
			.style("text-anchor", "start")
			.text("Non USA");

	});



}