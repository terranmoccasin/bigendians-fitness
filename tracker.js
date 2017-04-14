import Rx from 'rxjs/Rx';

const participants = ['Michael', 'Charles'];

const categories = {'Pull-ups': 0, 'Chin-ups': 1, 'Sit-ups': 2, 'Push-ups': 3, 'Miles Ran': 4, 'Miles Biked': 5, 'Weight': 6};

function init() {
  let observables = [];
  participants.forEach((participant) => {
    let obs$ = Rx.Observable.create((observer) => {
      let handleResponse = (response) => {
        observer.next(response);
      };
      let query = new google.visualization.Query(buildUrl(participant));
      query.setQuery('select A, B, C, D, E, F, G, H where A <= toDate( now() )');
      query.send(handleResponse);
    });
    observables.push(obs$)
  });
  let sheetData$ = Rx.Observable.zip(...observables).map(data => {
    let result = {};
    data.forEach((d, i) => {
      result[participants[i]] = d.getDataTable();
    });
    return result;
  });

  sheetData$.subscribe(drawGraph('Pull-ups', 'gpullups'));
  sheetData$.subscribe(drawGraph('Chin-ups', 'gchinups'));
  sheetData$.subscribe(drawGraph('Sit-ups', 'gsitups'));
  sheetData$.subscribe(drawGraph('Push-ups', 'gpushups'));
  sheetData$.subscribe(drawGraph('Miles Ran', 'gmilesran'));
  sheetData$.subscribe(drawGraph('Miles Biked', 'gmilesbiked'));
}

const dateCol = {
  type: 'date',
  label: 'Date',
  pattern: 'M/d/yy'
};

const DATE_COL = 0;

function drawGraph(colName, divName) {
  return function(data) {
    // Hardcoded data from first sheet. This assumes all sheets have same setup.
    let table = data[participants[0]];
    let numRows = table.getNumberOfRows();
    let colIdx = table.getColumnIndex(colName);
    let rows = [];
    for (let i = 0; i < numRows; i++) {
      let row = [];
      row.push(table.getValue(i, DATE_COL));
      participants.forEach((participant, pIdx) => {
        row.push(data[participant].getValue(i, colIdx));
      });
      rows.push(row);
    }
    let graphTable = new google.visualization.DataTable();
    graphTable.addColumn(dateCol);
    graphTable.addColumn({
      type: table.getColumnType(colIdx),
      label: participants[0]
    });
    graphTable.addColumn({
      type: table.getColumnType(colIdx),
      label: participants[1]
    });
    graphTable.addRows(rows);
    var chart = new google.visualization.LineChart(document.getElementById(divName));
    chart.draw(graphTable, {
      title: colName,
      titleTextStyle: {
        fontSize: 25,
        bold: true,
      },
      height: 450,
      vAxis: {
        viewWindow: {
          min: 0
        }
      }
    });
  }
}

function buildUrl(sheetName) {
  return `https://docs.google.com/spreadsheets/d/1ME0OIoL0XgF0d-F9ba47Pt3BV6GDPqH6wPtXEm-Q25k/gviz/tq?sheet=${sheetName}&headers=1`;
}

google.charts.load('current', { packages: ['corechart', 'line'] });
google.charts.setOnLoadCallback(init);