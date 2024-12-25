+++
date = 2024-01-01T01:01:01+09:00
lastmod = ""
draft = true

weight = 3000

title = "Markdown test ground"
summary = "Make sure this post is not visible"

isCJKLanguage = true

tags = []
categories = []

+++


{{< plotly >}}
{
  "data":"[{
      x: [1, 2, 3],
      y: [2, 1, 3],
      line: {color: 'red', simplify: false,}
  }]",
  "layout":"{
    sliders: [{
      pad: {t: 30},
      x: 0.05,
      len: 0.95,
      currentvalue: {xanchor: 'right', prefix: 'color: ',
        font: {color: '#888', size: 20}
      },
      transition: {duration: 500},
      steps: [{
        label: 'red',
        method: 'animate',
        args: [['red'], {
          mode: 'immediate',
          frame: {redraw: false, duration: 500},
          transition: {duration: 500}
        }]
      },{
        label: 'green',
        method: 'animate',
        args: [['green'], {
        mode: 'immediate',
        frame: {redraw: false, duration: 500},
        transition: {duration: 500}
        }]
      }, {
        label: 'blue',
        method: 'animate',
        args: [['blue'], {
          mode: 'immediate',
          frame: {redraw: false, duration: 500},
          transition: {duration: 500}
        }]
      }]
    }],
    updatemenus: [{
      type: 'buttons',
      showactive: false,
      x: 0.05,
      y: 0,
      xanchor: 'right',
      yanchor: 'top',
      pad: {t: 60, r: 20},
      buttons: [{
        label: 'Play',
        method: 'animate',
        args: [null, {
          fromcurrent: true,
          frame: {redraw: false, duration: 1000},
          transition: {duration: 500}
        }]
      }]
    }]
  }",
  "frames":"
  [{
    name: 'red',
  data: [{
    y: [2, 1, 3],
    'line.color': 'red'
  }]
}, {
  name: 'green',
  data: [{
    y: [3, 2, 1],
    'line.color': 'green'}]
}, {
  name: 'blue',
  data: [{
    y: [1, 3, 2],
    'line.color': 'blue'}]
}]
"
}
{{</ plotly >}}

{{< d3 >}}
const width = 640;
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

// Declare the x (horizontal position) scale.
const x = d3.scaleUtc()
    .domain([new Date("2023-01-01"), new Date("2024-01-01")])
    .range([marginLeft, width - marginRight]);

// Declare the y (vertical position) scale.
const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height - marginBottom, marginTop]);

// Create the SVG container.
const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height]);

// Add the x-axis.
svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x));

// Add the y-axis.
svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y));

  // Return the SVG element.
  canvas.append(svg.node());

{{</ d3 >}}