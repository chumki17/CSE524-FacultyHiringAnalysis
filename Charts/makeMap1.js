function makeMap() {

    var w = 1700, h = 500;

    var svg = d3.select('#map-area').append('svg')
        .attr('width', w)
        .attr('height', h);

    var color_range = d3.scale.linear().range(["#d8ddd8", "#A2D9CE"]).interpolate(d3.interpolateLab);

    var states_data = d3.map();

    var tool_tip = d3.tip()
        .attr('class', 'd3-tool_tip')
        .attr('data-html', 'true')
        .offset([-5, 0])
        .html(function (d) {
            var data = states_data.get(d.properties.name);
            if (data) {
                var tip_msg = "<b>" + data.states + ": " + (data.ratio).toFixed(2) + "</b>";
                return tip_msg;
            } else {
                return "No school data";
            }

        })

    svg.call(tool_tip);

    var states_map = d3.geo.albersUsa()
        .scale(1100)
        .translate([w / 2, h / 2]);

    var path = d3.geo.path()
        .projection(states_map);


    queue()
        .defer(d3.json, "USA.json")
        .defer(d3.csv, "state_gender_ratio_data_normalized.csv", setStatesData) // process
        .await(loadStatesData);

    function setStatesData(d) {
        d.norm_ratio = +d.norm_ratio;
        d.ratio = +d.ratio;
        states_data.set(d.states, d);
        return d;
    }

    function getColor(d) {
        var data = states_data.get(d.properties.name);
        if (data) {
            // if (data.norm_ratio === 0) {
            //   return "#f4d03f";    
            // } else {
            return color_range(data.norm_ratio * 10);
            // }

        } else {
            return "#EAECEE";
        }
    }


    function loadStatesData(error, usa, norm_ratio) {

        color_range.domain(d3.extent(norm_ratio, function (d) { return d.norm_ratio; }));

        var states = topojson.feature(usa, usa.objects.units).features;

        svg.selectAll('path.states')
            .data(states)
            .enter()
            .append('path')
            .attr('class', 'states')
            .attr('d', path)
            .on('mouseover', tool_tip.show)
            .on('mouseout', tool_tip.hide)
            .attr('fill', function (d, i) {
                return getColor(d);
            })
            .append("title");

    }
}