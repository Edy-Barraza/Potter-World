// var timeline is the svg 'canvas' that we will now draw on for
// the rest of the visualization
var timeline = d3.select("#timeline").append("svg")
  .attr("width", 1000)
  .attr("height", 500)
  .style("overflow", "visible")

// Scale of f(book number) = some in-browser pixel
var bookScale = d3.scaleLinear()
                .domain([1,7]) // input elements
                .range([20,400]) // in browser pixels

//Scale of corresponding colors for each classification of a spells
function spellColor(classification) {
 if (classification == "Charm") return "#1b9e77";
  else if (classification == "Curse") return "#d95f02";
  else if (classification == "Spell") return "#7570b3";
}

function spellHeight(classification) {
  if (classification == "Charm") return -10;
  else if (classification == "Curse") return 2;
  else if (classification == "Spell") return 14;
}

// This array holds all character positions for each book.
// We will use this array to find minimum and maximum character positions
var minmax = {"1":[], "2":[], "3":[], "4":[], "5":[], "6":[], "7":[]}

// Array of titles for y-axis labels
var titles = ["Sorceror's Stone",
              "Chamber of Secrets",
              "Prisoner of Azkaban",
              "Goblet of Fire",
              "Order of Phoenix",
              "Half-Blood Prince",
              "Deathly Hallows"]

var classifications = ["Charm", "Curse", "Spell"]

// Makes y-axis labels
for (var i = 0; i < titles.length; i++){
  timeline.append("text")
    .attr("x", 2)
    .attr("y", bookScale(i+1))
    .text(titles[i])
    .style("fill", "grey")
    .call(wrap, 75)

  for (var j = 0; j < 3; j++){
    timeline.append("line")
      .attr("x1", 100)
      .attr("x2", 1200)
      .attr("y1", bookScale(i+1) + spellHeight(classifications[j]))
      .attr("y2", bookScale(i+1) + spellHeight(classifications[j]))
      .style("stroke", spellColor(classifications[j]))
      .style("opacity", .5)

      timeline.append("text")
        .attr("x", 100)
        .attr("y", bookScale(i+1) + spellHeight(classifications[j]))
        .style("font-size", 8)
        .style("fill", spellColor(classifications[j]))
        .style("opacity", .5)
        .text(classifications[j])
  }

}

// Pushes character positions into array minmax from above
for (var i = 0; i < var_mention.length; i++){
  var index = var_mention[i];
  minmax[index.Book.substring(0, 1)].push(index.Position)
}

// Defines tip that shows when hovering
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(spell, context) {
      return "<b>" + spell + "</b><br>" + context
    })

timeline.call(tip);

// X-scale for relative character counts
var xScale = d3.scaleLinear()
                .domain([0, d3.max(minmax["5"])-d3.min(minmax["5"])]) // input elements
                .range([150,1200]) // in browser pixels

var xAxis = d3.axisBottom(xScale).ticks(5).tickSize(-430)

timeline.append("g")
  .attr("class", "grid")
  .attr("transform", "translate(0, 430)")
  .call(xAxis)

timeline.append("text")
  .attr("x", 550)
  .attr("y", 470)
  .text("Relative Book Character Count")

// For each spell, appends a circle to the book timelines
for (var i = 0; i < var_mention.length; i++){
  var index = var_mention[i];
  var book = index.Book.substring(0, 1);

  timeline.append("circle")
    .attr("class", index.Spell + " " + index.Concordance)
    .attr("cx", 150 + (index.Position - d3.min(minmax[book]))/270)
    .attr("cy", function(){
      var base = bookScale(index.Book.substring(0, 1))
      return base + spellHeight(find_by_mention(index.Spell).Classification)
    })
    .attr("r", 5)
    .style("fill", function(){
      return spellColor(find_by_mention(index.Spell).Classification)
    })
    .style("fill-opacity", .5)
    .style("stroke", function(){
      return spellColor(find_by_mention(index.Spell).Classification)
    })
    .style("stroke-width", 1)
    .on("mouseenter", function() {
          var spell = this.getAttribute("class").split(" ")[0];
          var context = this.getAttribute("class").substr(this.getAttribute("class").indexOf(" ") + 1);;
          tip.show(spell, context);
          d3.selectAll("." + spell).transition()
            .attr("r", 10)
            .style("fill-opacity", 1)

          d3.selectAll("circle:not(" + "." + spell + ")").transition()
            .attr("r", 3)
            .style("fill-opacity", .1)
        })
      .on("mouseleave", function() {
          var spell = this.getAttribute("class").split(" ")[0];
          var context = this.getAttribute("class").substr(this.getAttribute("class").indexOf(" ") + 1);;
          tip.hide(spell, context);
          d3.selectAll("circle").transition()
            .attr("r", 5)
            .style("fill-opacity", .5)

          d3.selectAll("circle:not(" + "." + spell + ")").transition()
            .attr("r", 5)
            .style("fill-opacity", .5)

     })
}

// Makes text on y-axis wrap, base code by Mike Bostock
// at https://bl.ocks.org/mbostock/7555321
function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}


function find_by_mention(mention) {
  for (var i=0; i<var_spell.length; i++){
    if (var_spell[i]["Spell(Lower)"] == mention) {
      return var_spell[i]
    }
  }
}
