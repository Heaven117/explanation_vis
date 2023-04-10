import * as d3 from "d3";

// node 为ref.current
export const radialBarChart = (node, config, data) => {
  d3.select(node).html("");
  data = JSON.parse(JSON.stringify(data));
  // console.log(data);
  // const newData = data.map(d => {
  //   d.value = Math.abs(d.value)
  //   return d
  // });
  // console.log(newData);

  const emptyHeight = config.height / 4;

  const SVG = d3
    .select(node)
    .attr(
      "viewBox",
      `${-config.width / 2} ${-config.height / 2} ${config.width} ${
        config.height
      }`
    )
    .style("width", config.width)
    .style("height", config.height)
    .style("font", "10px sans-serif")
    .append("g");

  // 放图的容器
  const relMap_g = SVG.append("g")
    .attr("class", "relMap_g")
    .attr("width", config.width)
    .attr("height", config.height);

  //颜色范围
  const color = (d) => {
    // console.log(d);
    return d < 0 ? "#98abc5" : "#ff8c00";
  };
  // const color = d3
  //   .scaleOrdinal()
  //   .domain(data.columns.slice(1))
  //   .range(["#98abc5", "#6b486b", "#ff8c00"]);

  //曲形柱状堆叠图
  const arc = d3
    .arc()
    .innerRadius((d) => y(d[0]))
    .outerRadius((d) => y(d[1]))
    .startAngle((d) => x(d.data.id))
    .endAngle((d) => x(d.data.id) + x.bandwidth())
    .padRadius(config.innerRadius);

  const x = d3
    .scaleBand()
    .domain(data.map((d) => d.id))
    .range([0, 2 * Math.PI])
    .align(0);

  const y = d3
    .scaleRadial()
    .domain([0, 3])
    .range([emptyHeight, emptyHeight + 100]);

  relMap_g
    .append("g")
    .selectAll("g")
    .data(() => {
      // console.log(data);
      return d3.stack().keys(["value"])(data);
    })
    .join("g")
    .attr("fill", "red")
    .selectAll("path")
    .data((d) => d)
    .join("path")
    .attr("fill", (d) => color(d.data.value))
    .attr("d", arc);

  relMap_g
    .append("circle")
    .attr("cx", "0px")
    .attr("cy", "0px")
    .attr("r", "8")
    .attr("fill", "#8a89a6")
    .attr("opacity", "0.7");

  // const legend = (g) =>
  //   g
  //     .append("g")
  //     .selectAll("g")
  //     .data(['influence'])
  //     .join("g")
  //     .attr(
  //       "transform",
  //       (d, i) =>
  //         `translate(${-config.height / 2 + 20},${
  //           (i - (1 + 8)) * 20
  //         })`
  //     )
  //     .call((g) =>
  //       g
  //         .append("rect")
  //         .attr("width", 18)
  //         .attr("height", 18)
  //         .attr("fill", color)
  //     )
  //     .call((g) =>
  //       g
  //         .append("text")
  //         .attr("x", 24)
  //         .attr("y", 9)
  //         .attr("dy", "0.35em")
  //         .text((d) => d)
  //     );

  // relMap_g.append("g").call(legend);

  // 交互的容器
  const interMap_g = SVG.append("g")
    .attr("class", "interMap_g")
    .attr("postion", "relative")
    .attr("width", config.width)
    .attr("height", config.height);
  // .on("mousemove", (event) => {
  //   interMap_g
  //     .append("circle")
  //     .attr("fill", "blue")
  //     .attr("cx", event.layerX - config.width / 2)
  //     .attr("cy", event.layerY - config.height / 2)
  //     .attr("r", 3);
  // });

  // 交互区域构建
  var arc_brush = d3
    .arc()
    .outerRadius(config.outerRadius)
    .innerRadius(config.innerRadius);

  interMap_g.selectAll("path");
  // .data([{ startAngle: 0, endAngle: 2 * Math.PI, padAngle: 0 }])
  // .join("path")
  // .attr("d", arc_brush)
  // .attr("fill", "#7b6888")
  // .attr("opacity", "0");

  const calAngle = (fEndX_Vec, fEndY_Vec) => {
    const fEndX = fEndX_Vec - config.width / 2;
    const fEndY = fEndY_Vec - config.height / 2;
    const fLen = Math.sqrt(fEndX * fEndX + fEndY * fEndY);
    if (fLen === 0) return 0;
    let fAngle = Math.acos(fEndY / fLen);

    if (fEndX < 0) {
      // fAngle = 2 * Math.PI - fAngle;
      fAngle = -fAngle;
    }

    return Number(fAngle.toFixed(2));
  };

  var time_s = true;
  let lastPos = [
    {
      x: config.width / 2 - 5,
      y: config.height,
    },
    {
      x: config.width / 2 + 5,
      y: config.height,
    },
  ];
  // let lastPos = [
  //   calAngle(config.width / 2 - 5, config.height),
  //   calAngle(config.width / 2 + 5, config.height),
  // ];
  console.log(config.width / 2 - 5, config.height);

  const drag_x = (data, width, height) => {
    function dragstarted(event, d) {
      event.sourceEvent.stopPropagation();
      console.log(
        "dragstarted",
        event,
        config.width - event.sourceEvent.layerX,
        config.height - event.sourceEvent.layerY
      );
    }
    function dragCircle(event, d, i) {
      event.sourceEvent.stopPropagation();

      // console.log("index", i, d);
      // 延时刷新
      if (time_s) {
        time_s = false;
        setTimeout(() => {
          time_s = true;
        }, 100);
      } else {
        return;
      }
      const mouseX = event.sourceEvent.layerX;
      const mouseY = config.height - event.sourceEvent.layerY;
      // var Angle = 0;
      // var A = { x: width, y: height };
      // var B = { x: width, y: 0 };
      // var lengthAB = Math.sqrt(Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2));
      // var lengthAC = Math.sqrt(
      //   Math.pow(A.x - event.sourceEvent.layerX, 2) +
      //     Math.pow(A.y - event.sourceEvent.layerY, 2)
      // );
      // var lengthBC = Math.sqrt(
      //   Math.pow(B.x - event.sourceEvent.layerX, 2) +
      //     Math.pow(B.y - event.sourceEvent.layerY, 2)
      // );
      // var cosA =
      //   (Math.pow(lengthAB, 2) +
      //     Math.pow(lengthAC, 2) -
      //     Math.pow(lengthBC, 2)) /
      //   (2 * lengthAB * lengthAC);
      // Angle = Math.acos(cosA);

      // if (event.sourceEvent.layerX < width) Angle = 2 * Math.PI - Angle;

      // d3.select(this)
      //   .attr("transform", `rotate(${(Angle * 180) / Math.PI}, ${0} ${0})`)
      //   .attr("text", Angle);

      d3.select(this)
        .data([
          {
            startAngle: calAngle(mouseX, mouseY),
            endAngle: calAngle(mouseX, mouseY) - 0.04,
          },
        ])
        .attr("d", arc_brush)
        .attr("text", (d) => d);

      console.log("event", mouseX, mouseY, lastPos[0]);

      if (d3.select(this).attr("class") == "Selec_cri") {
        var a =
          parseFloat(
            d3.selectAll(".Selec_cri")._groups[0][0].attributes.text.value
          ) - 0.0001;
        var b =
          parseFloat(
            d3.selectAll(".Selec_cri")._groups[0][1].attributes.text.value
          ) + 0.01;
        if (a > b) a = -2 * Math.PI + a;

        // 绘制指针间扇形面积
        d3.select(".Selec_area")
          .selectAll("path")
          .data([{ startAngle: a, endAngle: b, padAngle: 0 }])
          .join("path")
          .attr("d", arc_brush)
          .attr("fill", "#7b6888")
          .attr("class", "Selec_area")
          .attr("transform", `rotate(${0}, ${0} ${0})`)
          .attr("opacity", "0.2");

        // 根据指针角度 筛选数据
        var selectData = new Array();
        var selectData_rev = new Array();
        data.forEach(function (item, i) {
          var data_rotate = x(item.id) + x.bandwidth() / 2;
          if (a < 0) {
            if (data_rotate < b && data_rotate > 0) selectData.push(item);
            if (data_rotate < 2 * Math.PI && data_rotate > a + 2 * Math.PI)
              selectData_rev.push(item);
          }
          if (a > 0)
            if (data_rotate < b && data_rotate > a) selectData.push(item);
        });
        // 绘制所选区域数据
        let c = selectData_rev.concat(selectData);
        DrawSelectData(c, width, height);
      }
    }
    function endDragging(event, d) {}

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragCircle)
      .on("end", endDragging);
  };

  function DrawSelectData(testdata, width, height) {
    const x = d3
      .scaleBand()
      .domain(testdata.map((d) => d.id))
      .range([-width, width])
      .padding(0.1);
    const y = d3
      .scaleLinear()
      .domain([0, d3.max(testdata, (d) => d.value)])
      .rangeRound([width, width - 90]);

    testdata.columns = Object.keys(testdata[0]).slice(0, 4);

    scaleMap_g
      .selectAll("g")
      .data(d3.stack().keys(["value"])(testdata))
      .join("g")
      .selectAll("rect")
      .attr("fill", (d) => color(d.data.value))
      .data((d) => d)
      .join("rect")
      .attr("class", "selectRect")
      .attr("x", (d, i) => x(d.data.id))
      .attr("y", (d) => {
        return y(d[1]);
      })
      .on("click", (event, d) => {
        //小矩形的id  例，u217
        console.log(d.data.id);
        // store.commit("global/SET_USER_ID", d.data.id);
      })
      .attr("id", (d) => "rect_" + d.data.id)
      .attr("transform", `translate(0, 0)`)
      .attr("height", (d) => Math.abs(y(d[0]) - y(d[1])))
      .attr("width", x.bandwidth());

    d3.selectAll(".selectRect").selectAll("title").remove(); //防止重复append

    d3.selectAll(".selectRect")
      .append("title")
      .text((d) => d.data.id);
  }

  //选择器
  const inter = interMap_g.append("g");

  inter
    .selectAll("path")
    .data([
      {
        startAngle: calAngle(config.width / 2 - 5, config.height),
        endAngle: calAngle(config.width / 2 - 5, config.height) - 0.04,
      },
      {
        startAngle: calAngle(config.width / 2 + 5, config.height),
        endAngle: calAngle(config.width / 2 + 5, config.height) + 0.04,
      },
    ])
    .join("path")
    .attr("d", arc_brush)
    .attr("fill", "#7b6888")
    .attr("class", "Selec_cri")
    .call(drag_x(data, config.width / 2, config.height / 2))
    .attr("text", 0)
    .attr("z-index", 99)
    .attr("transform", `rotate(${0}, ${0} ${0})`)
    .attr("opacity", "0.7");

  inter.append("g").attr("class", "Selec_area");

  const scaleMap_g = SVG.append("g").attr("class", "scaleMap_g");
};
