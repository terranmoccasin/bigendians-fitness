var participants = ['Michael', 'Charles'];

var FITNESS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1ME0OIoL0XgF0d-F9ba47Pt3BV6GDPqH6wPtXEm-Q25k/gviz/tq?gid=0&headers=1';
var TMOC_QUERY = 'select A, B, C';

function drawGID() {
  var query = new google.visualization.Query(FITNESS_SHEET_URL);
  query.setQuery(TMOC_QUERY);
  query.send(handleQueryResponse)
}

function handleQueryResponse(response) {
  if (response.isError()) {
    alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }

  var data = response.getDataTable();
  var chart = new google.charts.Line(document.getElementById('chart_div'));
  chart.draw(data, { height: 400 });
}

google.charts.load('current', { packages: ['corechart', 'line'] });
google.charts.setOnLoadCallback(drawGID);