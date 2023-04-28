(function () {
    var width = 800, height = 600;

    Promise.all([
        d3.json("https://raw.githubusercontent.com/deldersveld/topojson/master/world-continents.json"),
        d3.json("world.topojson"), //load the world TopoJSON data
        d3.csv("./p3data.csv")

    ]).then((data) => {
        console.log(data);

        const topology = data[0];
        const world = data[1];
        const songs = data[2];
        const svg = d3.select("#geomap").append("g").attr('transform', 'translate(50,50)');
        const topo = topojson.feature(topology, topology.objects.continent);
        var projection = d3.geoMercator().scale(120).translate([width / 2, height / 1.5]);
        var path = d3.geoPath(projection);
        const regions = new Set(songs.map(d => d.Region));

        var colorScale = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(Array.from(regions));

        svg.append("g")
            .selectAll("path")
            .data(topo.features)
            .join("path")
            .attr("d", path)
            .attr("fill", d => colorScale(d.properties.continent))
            .attr("stroke", "white")
            .attr("stroke-width", "1px");

        svg.append("g")
            .selectAll("path")
            .data(topojson.feature(world, world.objects.countries).features)
            .join("path")
            .attr("d", path)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", "0.5px")
            .attr("class", "country")
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .attr("fill", "lightblue");

                tooltip.style("opacity", 1)
                    .html(d.properties.name)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");

                svg.append("circle")
                    .attr("class", "country-circle")
                    .attr("cx", event.pageX + 5)
                    .attr("cy", event.pageY - 20)
                    .attr("r", 20)
                    .attr("fill", "none")
                    .attr("stroke", "black")
                    .attr("stroke-width", "1px");

                svg.append("text")
                    .attr("class", "country-label")
                    .attr("x", event.pageX + 5)
                    .attr("y", event.pageY - 20)
                    .text(d.properties.name)
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "central")
                    .attr("font-size", "20px")
                    .attr("font-weight", "bold");
            })
            .on("mouseout", function (d) {
                d3.select(this)
                    .attr("fill", "none");

                tooltip.style("opacity", 0);

                svg.selectAll(".country-circle").remove();
                svg.selectAll(".country-label").remove();
            });

        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
    });
})();
