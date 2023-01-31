// insert footnote which technologies were used to build this page

let req = new XMLHttpRequest();
req.open("GET", "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", true);
req.send();
req.onload = () => {
  let json = JSON.parse(req.responseText);
  d3.select("body").append("h1").attr("id", "title").text(json.name).style("text-align", "center");
  let dataset = json.data;
  width = 700;
  height = 500;
  padding = 50;
  console.log("json", json);

  let tooltip = svg.select("body").append("div").attr("id", "tooltip");

  const xScale = d3
    .scaleTime()
    .domain([new Date(dataset[0][0]), new Date(dataset[dataset.length - 1][0])])
    .range([padding, width - padding]);

  const yScale = d3.scaleLinear();
  yScale.domain([0, d3.max(dataset, (d) => d[1])]).range([height - padding, padding]);

  const svg = d3.select("body").append("svg").attr("width", width).attr("height", height).style("background-color", "pink").style("display", "block").style("margin", "auto");

  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .on("mouseover", (event, d) => {})
    .attr("width", "1px")
    .attr("height", (d) => height - padding - yScale(d[1]))
    .attr("x", (d) => xScale(new Date(d[0])))
    .attr("y", (d) => yScale(d[1]));

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

  // -----------------------------------------------------------
  // -----------------------------------------------------------
  // -----------------------------------------------------------
  // -----------------------------------------------------------
  // -----------------------------------------------------------
  // -----------------------------------------------------------
};
