//-----------------Data request----------------
let req = new XMLHttpRequest();
req.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", true);
req.send();
req.onload = () => {
  let json = JSON.parse(req.responseText);

  //-----------------Creating main svg element ------------------
  let dataset = json.data;
  width = 700;
  height = 500;
  padding = 50;
  console.log("json", json);

  const svg = d3.select("body").append("div").attr("id", "svg-container").append("svg").attr("width", width).attr("height", height);

  //----------------Scaling-----------------
  const xScale = d3
    .scaleTime()
    .domain([new Date(dataset[0][0]), new Date(dataset[dataset.length - 1][0])])
    .range([padding, width - padding]);

  const yScale = d3.scaleLinear();
  yScale.domain([0, d3.max(dataset, (d) => d[1])]).range([height - padding, padding]);

  //-----------------Header---------------------
  svg
    .append("text")
    .attr("id", "title")
    .attr("x", width / 2)
    .attr("y", padding - 5)
    .text(
      "USA: " +
        json.name.slice(
          0,
          json.name.split("").findIndex((char) => !/\w|\s/.test(char))
        )
    )
    .style("text-anchor", "middle");

  // ------------------Bar Chart-----------------

  let tooltip = d3.select("body").append("div").attr("id", "tooltip");

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .on("mouseover", (e, d) => {
      const tooltipText = convertDate(d[0]) + ": $" + convertNumber(d[1]) + " Billion";
      tooltip
        .text(tooltipText)
        .style("opacity", "100%")
        .style("left", e.clientX + 10 + "px")
        .style("top", e.clientY - 20 + "px")
        .attr("data-date", d[0]);
    })
    .on("mouseout", (event, d) => {
      tooltip.style("opacity", "0%");
    })
    .attr("width", (width - padding * 2) / dataset.length)
    .attr("height", (d) => height - padding - yScale(d[1]))
    .attr("x", (d) => xScale(new Date(d[0])))
    .attr("y", (d) => yScale(d[1]));

  // ----------------------axis--------------------

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y"));
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);

  const yAxis = d3.axisLeft(yScale);
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis);

  svg
    .append("text")
    .text(
      json.name.slice(
        0,
        json.name.split("").findIndex((char) => !/\w|\s/.test(char))
      )
    )
    .attr("y", padding + 20)
    .attr("x", 0 - padding)
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "end");

  // --------------Note below the Bar Chart--------------
  svg
    .append("text")
    .html("More information: http://www.bea.gov/national/pdf/nipaguid.pdf")
    .on("click", function () {
      window.open("http://www.bea.gov/national/pdf/nipaguid.pdf", "_blank");
    })
    .attr("class", "note")
    .attr("y", height - 10)
    .attr("x", width - padding)
    .style("text-anchor", "end");

  //-----------Data formatting for tooltips (on hover)--------------

  const convertDate = (date) => {
    const year = date.slice(0, 4);
    const quarterNumeric = date.slice(5, 7);
    const quarterString = quarterNumeric === "01" ? "Q1" : quarterNumeric === "04" ? "Q2" : quarterNumeric === "07" ? "Q3" : "Q4";

    return year + " " + quarterString;
  };

  const convertNumber = (number) =>
    number.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  //------------Footer--------------

  d3.select("body").append("footer").text("This Bar Chart was created using: HTML, CSS, JavaScript and D3 svg-based visualization library");
};
