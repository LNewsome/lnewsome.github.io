"use strict";
const width = window.innerWidth;
const height = window.innerHeight;
const n = (width*height)/3000;
const r = 5;
const color = d3.scale.quantize().domain([10000, 7250]).range(['#ea7b49', '#f39841', '#fcb639', '#baba55', '#79be73', '#32b0b4', '#4790c9', '#5261c9', '#7b5ab0', '#a45396', '#cd4c7d', '#f54563']);

function polygon(d) {
  return "M" + d.join("L") + "Z";
}

let data = d3.range(n).map(i=>{
                     let angle = r * (i + 10);
                     return {
                       x: angle*Math.cos(angle) + width/2,
                       y: angle*Math.sin(angle) + height/2
                     }
                   });

const voronoi = d3.geom.voronoi().x(d=> d.x).y(d=>d.y);

let svg = d3.select('#container')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

let force = d3.layout.force()
        .charge(-300)
        .size([width, height])
        .on("tick", update);

force.nodes(data).start();

let circle = svg.selectAll('circle');
let path = svg.selectAll('path');

function update(e){
  path = path.data(voronoi(data));
  path.attr('d', polygon)
  path.enter()
      .append('path')
      .style("fill", d=>color(d3.geom.polygon(d).area()));

  path.on('mousemove', function(d, i){
    data[i].x = data[i].x + Math.sin(i);
    data[i].y = data[i].y + Math.cos(i);
    force.nodes(data).start();
    path.on("mousemove",null);
  })

  path.exit().remove();

circle = circle.data(data);
circle.enter()
      .append('circle')
      .attr('r', 5);

circle.attr('cx', d=> d.x)
      .attr('cy', d=> d.y)
      .attr('fill', '#fff')
      .attr('fill-opacity', 0.9)

circle.exit().remove();
}
