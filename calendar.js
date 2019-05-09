var week_days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
years_months = ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'];


//danasnji datum
var today = new Date();
console.log(today);
console.log('=============');

//number of days in a month 
function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

console.log(daysInMonth(today.getMonth(), today.getFullYear()));
console.log('==============');


// array of 6 months from now
function getMonths() {
  var today = new Date();
  var month = today.getMonth();

  var monthArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  var menuMonths = [];
  for (var count = 6; count >= 0; count--)
    menuMonths.push(monthArray[((12 + month - count) % 12)]);

  return menuMonths;
}

console.log(getMonths());
console.log("=====================================");
console.log("");
console.log("");
console.log("Generisanje kalendara");
console.log("=====================================");


//generisanje kalendara

//sizes for svg and g
var width = 1200,
  height = 250,
  cellSizeW = 22,
  cellSizeH = 20;


//formatiranje datuma
var day = d3.time.format("%w"),
  week = d3.time.format("%U"),
  percent = d3.format(".1%"),
  format = d3.time.format("%Y%m%d"),
  parseDate = d3.time.format("%Y%m%d").parse;


//scales and axes
var x = d3.scale.ordinal()
  .domain(d3.range(1, 8))
  .rangeBands(years_months)

var y = d3.scale.ordinal()
  .domain(week_days)
  .rangeBands([height, 0])

var scaleX = d3.scale.ordinal()
  .domain(d3.range(0, 6))
  .rangeBands([0, 250 / 1.9]);

var scaleY = d3.scale.ordinal()
  .domain(d3.range(1, 8))
  .rangeBands([height, 0]);

var xAxis = d3.svg.axis()
  .scale(x)
  .ticks(getMonths().reverse())
  .innerTickSize(0)
  .outerTickSize([0])
  .orient('top')

var yAxis = d3.svg.axis()
  .scale(y)
  .ticks(week_days)
  .innerTickSize(0)
  .outerTickSize([0])
  .orient('left')

//svg
var svg = d3.select('.calendar-view')
  .append('svg')
  .attr('class', "svg-cal")
  .attr('width', width)
  .attr('height', height)
  .style('background', '#ecf5f9')

//week days on y axes
svg.append('g')
  .attr('class', 'calendarDays')
  .attr("transform", "translate(32,8)")
  .attr('font-size', '14px')
  .style('fill', '#cc0066')
  .style('font-weight', '600')
  .style('font-style','italic')
  .append('g')
  .attr('class', 'yAxisCal')
  .call(yAxis)


//months on x axes
svg.append('g')
  .attr('class', 'calendarMonths')
  .attr("transform", "translate(35,13)");

//show last 6 months
var counter = 0;
var calendarWidth = width / 7;
var rm = 2;

for (var i = 7; i > 0; i -= 1, counter++) {

  var indexOfMonths = new Date(today.getFullYear(), today.getMonth() - i + 1);
  console.log("index of month: " + indexOfMonths.getMonth());

  var monthName = years_months[indexOfMonths.getMonth()];

  var totalNumberOfDays = daysInMonth(indexOfMonths.getMonth() + 1, today.getFullYear());
  console.log("total numbers of month: " + totalNumberOfDays);

  // current month name
  console.log("name of months: " + monthName + " \n===============================");

  //first and last day of months
  var monthStart = new Date(indexOfMonths.getFullYear(), indexOfMonths.getMonth(), 1);
  var getDay = monthStart.getDay();
  var monthEnd = new Date(indexOfMonths.getFullYear(), indexOfMonths.getMonth() + 1, 0);
  var monthLength = Math.round((monthEnd - monthStart) / (1000 * 60 * 60 * 24));

  console.log(getDay);
  console.log(monthStart);
  console.log(monthEnd);
  console.log(monthLength);
  console.log('=============');


  // const d = new Date();
  const fromDate = new Date(today.getFullYear(), today.getMonth() - (i - 1), 1);
  const toDate = new Date(today.getFullYear(), today.getMonth() - (i - 2), 0);

  const dates = d3.time.scale()
    .domain([fromDate, toDate])
    .ticks(d3.time.day, 1);

  //canvas for months
  var monthGroup = d3.select('.calendarMonths')
    .append('g')
    .attr('class', 'monthGroup_' + counter)
    .append('g')
    .attr('class', 'canvas')
    .attr('transform', 'translate(' + (calendarWidth * counter) + ', 2)');

  //months name label
  var monthGroupLabel = d3.select('.monthGroup_' + counter)
    .append('g')
    .attr('class', 'month_label')
    .style("text-anchor", "middle")
    .attr('transform', 'translate(' + (calendarWidth * counter + 50) + ', 0)')
    .append('text')
    .attr('font-size', '14px')
    .style('fill', '#cc0066')
    .style('font-style', 'italic')
    .style('font-weight', '600')
    .text(monthName);


  // loop for each totalNumberOfDays

  dates.forEach(date => {
    const currentDate = date.getDate();
    // Set number of week days. Monday is 1 and Sunday 7
    const weekDay = date.getDay() === 0 ? 7 : date.getDay();
    // Set number of weeks in month. First week is 0 and last is 4 or 5
    const weekNumber = Math.ceil((currentDate - weekDay) / 7);

    monthGroup.append('rect')
      .data([getDay, monthEnd])
      .attr("class", "day_" + currentDate)
      .attr("width", cellSizeW -rm)
      .attr("height", cellSizeH)
      .attr('x', scaleX(weekNumber))
      .attr('y', scaleY(weekDay))
      // .attr("fill", '#cc0066');
    .attr('fill', '#ffe6cc')
    .style('stroke', '#cc0066')
    .style('stroke-width', '0.5px')

    monthGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .style('fill', '#000099')
      .attr('x', scaleX(weekNumber))
      .attr('y', scaleY(weekDay))
      .attr('dx', 9)
      .attr('dy', 15)
      .text(currentDate)

  })
}