import * as d3 from "d3";

export const draw_percent_bar = (node, result) => {
  var bar_width = 200,
    bar_height = 20;

  var x_buffer = 10,
    y_buffer = 7;

  const id = "inf_percentBar_lin_gradient";
  var xScale = d3.scaleLinear().domain([-1, 1]).rangeRound([0, bar_width]);

  const good_col = "#ff8c00",
    bad_col = "#98abc5";

  // !先清除
  d3.select(node).html("");
  var svg = d3
    .select(node)
    .attr("width", 270)
    .attr("height", 52)
    .append("g")
    .attr("transform", "translate(" + x_buffer + "," + y_buffer + ")");

  var defs = svg.append("defs");

  // Setting the color gradient
  var linearGradient = defs
    .append("linearGradient")
    .attr("id", id)
    .attr("x1", "15%")
    .attr("x2", "85%")
    .attr("y1", "0%")
    .attr("y2", "0%");

  var colorScale = d3.scaleLinear().range([bad_col, "white", good_col]);

  linearGradient
    .selectAll("stop")
    .data(colorScale.range())
    .enter()
    .append("stop")
    .attr("offset", function (d, i) {
      return i / (colorScale.range().length - 1);
    })
    .attr("stop-color", function (d) {
      return d;
    });

  // Drawing the rectangle with curved edges
  svg
    .append("rect")
    .attr("class", "bg_bar")
    .attr("height", bar_height)
    .attr("width", bar_width)
    .attr("rx", 10)
    .attr("ry", 10)
    .style("stroke", "black")
    .style("stroke-width", 1)
    .style("fill", `url(#${id})`);

  svg
    .append("g")
    .append("line")
    .attr("class", "per_marker")
    .attr("x1", function () {
      return xScale(result);
    })
    .attr("y1", bar_height + 1.3)
    .attr("x2", function () {
      return xScale(result);
    })
    .attr("y2", bar_height + 5)
    .attr("stroke", function (d) {
      if (result > 0) {
        return good_col;
      } else {
        return bad_col;
      }
    })
    .style("stroke-linecap", "round")
    .style("stroke-width", 2);

  svg
    .append("g")
    .append("text")
    .attr("class", "per_marker")
    .text(function () {
      return Math.round(result * 100).toString() + "%";
    })
    .attr("x", function () {
      return xScale(result) + 5;
    })
    .attr("y", bar_height + 20)
    .attr("font-family", "sans-serif")
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .attr("fill", function (d) {
      if (result > 0) {
        return good_col;
      } else {
        return bad_col;
      }
    })
    .attr("text-anchor", "middle");
};
