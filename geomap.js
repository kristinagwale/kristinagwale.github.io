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
        const svg = d3.select("#geomap").append("g").attr('transform', 'translate(50,50)')
        const topo = topojson.feature(topology, topology.objects.continent);
        var projection = d3.geoMercator().scale(145).translate([width / 2, height / 1.5]);
        var path = d3.geoPath(projection);
        country_dict = {
            "1": "Global",
            "2": "US",
            "3": "GB",
            "4": "CA",
            "5": "AU",
            "6": "DE",
            "7": "MX",
            "8": "NL",
            "9": "BR",
            "10": "SE",
            "11": "FR",
            "12": "ES",
            "13": "IT",
            "14": "PH",
            "15": "DK",
            "16": "NO",
            "17": "NZ",
            "18": "IE",
            "19": "CL",
            "20": "AR",
            "21": "PT",
            "22": "CH",
            "23": "BE",
            "24": "ZA",
            "25": "TR",
            "26": "FI",
            "27": "PL",
            "28": "CO",
            "29": "SG",
            "30": "PE",
            "31": "IN",
            "32": "ID",
            "33": "MY",
            "34": "AT",
            "35": "GR",
            "36": "CR",
            "37": "IL",
            "38": "TW",
            "39": "RO",
            "40": "HU",
            "41": "DO",
            "42": "HK",
            "43": "EC",
            "44": "AE",
            "45": "CZ",
            "46": "IS",
            "47": "PA",
            "48": "GT",
            "49": "HN",
            "50": "BG",
            "51": "LT",
            "52": "JP",
            "53": "LV",
            "54": "SA",
            "55": "SK",
            "56": "PY",
            "57": "SV",
            "58": "NG",
            "59": "MA",
            "60": "TH",
            "61": "EE",
            "62": "BO",
            "63": "UY",
            "64": "RU",
            "65": "LU",
            "66": "NI",
            "67": "EG",
            "68": "MT",
            "69": "CY",
            "70": "KR",
            "71": "VN",
            "72": "PK",
            "73": "UA",
            "74": "VE",
            "75": "KZ",
            "76": "AD"
        }
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
                    .attr("fill", "lightgrey");

                var songsForCountry = songs.filter(song => song.CountryCode === country_dict[d.id]);
                var songList = "";
                if (songsForCountry.length > 0) {
                    songList = "<ul>";
                    songsForCountry.forEach(song => {
                        songList += "<li>" + song.Title + " - " + song.Streams + "</li>" + " - Global Charts:" + song.Global + "</li>";
                    });
                    songList += "</ul>";
                }

                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);

                tooltip.style("opacity", 1)
                    .html(d.properties.name)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");

                svg.append("rect")
                    .attr("class", "country-box")
                    .attr("x", event.pageX + 5)
                    .attr("y", event.pageY - 40)
                    .attr("width", 200)
                    .attr("height", 20 + songsForCountry.length * 60)
                    .attr("fill", "white")
                    .attr("stroke", "black")
                    .attr("stroke-width", "1px");

                svg.append("text")
                    .attr("class", "country-label")
                    .attr("x", event.pageX + 105)
                    .attr("y", event.pageY - 25)
                    .text(d.properties.name)
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "central");

                svg.append("foreignObject")
                    .attr("class", "song-list")
                    .attr("x", event.pageX + 10)
                    .attr("y", event.pageY - 15)
                    .attr("width", 180)
                    .attr("height", songsForCountry.length * 60)
                    .html(songList);
            })
            .on("mousemove", function (event) {
                tooltip.style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function (event, d) {
                d3.select(this)
                    .attr("fill", "none");

                tooltip.style("opacity", 0);

                svg.selectAll(".country-box").remove();
                svg.selectAll(".country-label").remove();
                svg.selectAll(".song-list").remove();
            });
        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
    });
})();
