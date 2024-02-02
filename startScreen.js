function setup(){
    var body = document.getElementsByTagName('body')[0];
    var tbl = document.createElement('table');
    //   tbl.style.width = '100%';
    var tbdy = document.createElement('tbody');
    for (var i = 0; i < 3; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < 2; j++) {
            var td = document.createElement('td');
            td.appendChild(document.createElement("button"))
            tr.appendChild(td)
        }
    tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl)
}