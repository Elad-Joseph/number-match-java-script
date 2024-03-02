var WINDOW_HEIGTH = window.innerHeight;
var WINDWON_WIDTH = window.innerWidth;
var Ysize = 10; // the maximum row in the board
var Xsize = 9;  // the maximum numbers in a row
var BOARD = Array.from(Array(Ysize), () => new Array(Xsize));
var GridsBOARD = Array.from(Array(Ysize), () => new Array(Xsize));
var ButtonDataMap = {};
var VisbuttonsInStart = 27;
var buttonSize = 50;
var heigthestNumber = 9;
var buttonClicked = new Array(2);
var clickCounter = 2;
var colors;
var lastButtonCords = [0,0];
var buttonsLeft = 0;
var NumbersAlive = new Array(heigthestNumber+1);
var addRowButton;
var NumbersOnBoard = new Array(0);
var numberAliveInRow = new Array(Ysize);
function setup(){
    for(var i = 0;i<Ysize;i++){numberAliveInRow[i] = 0;}
    colors = new colorStruct("#a8a3a3" , "#54de10" , "#c2bcbc");
    document.body.style.background = colors.Background;
    setupAddRowButton();
    createGrid();
    setupCSS();
    for(var i= 0;i<heigthestNumber+1;i++){NumbersAlive[i] = i;}
    for(var i = 0;i<Ysize;i++){
        for(var j = 0;j<Xsize;j++){
            value = 1;//Math.floor(Math.random()*heigthestNumber+1);
            NumbersAlive[value]++;
            createButton(i,j ,value);
            lastButtonCords = [i , j];
            if(!(i*Xsize+j < VisbuttonsInStart-1)){
                return 0;
            }
        }
    }
}
function setupCSS(){
    var root = document.querySelector(':root');
    root.style.setProperty('--size', buttonSize+'px');
    root.style.setProperty('--color', colors.Default);
    root.style.setProperty('--addRowSectionWidth' , (WINDWON_WIDTH-buttonSize*Xsize)+"px")
}
function createButton(y ,x ,value){
    BOARD[y][x].className = "game_button";
    BOARD[y][x].id = "button" + (y*Xsize+x);
    BOARD[y][x].onclick = function(){buttonPress(this.id)};
    BOARD[y][x].innerHTML = value;
    ButtonDataMap[BOARD[y][x].id] = new buttonData(y,x,BOARD[y][x],value , BOARD[y][x].id , colors.Default , true);
    NumbersOnBoard.push(value);
    buttonsLeft++;
    numberAliveInRow[y]++;
    lastButtonCords[0] = y;
    lastButtonCords[1] = x;
}
function createGrid(){
    var body = document.getElementsByTagName('body')[0];
    var tbl = document.createElement('table');
    var tbdy = document.createElement('tbody');
    for (var i = 0; i < Ysize; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < Xsize; j++) {
            var td = document.createElement('td');
            td.id = "buttonsTd";
            GridsBOARD[i][j] = td;
            if(i*Xsize+j < VisbuttonsInStart){
                BOARD[i][j] = document.createElement("button");
                td.appendChild(BOARD[i][j]);
            }
            tr.appendChild(td);
            if(i==0 && j==Xsize-1){
                var td = document.createElement("td");
                td.appendChild(addRowButton);
                td.id = "addButtonSection";
                td.rowSpan = Ysize;
                tr.appendChild(td);
            }
        }
        tbdy.appendChild(tr);
    }
    tbdy.appendChild(tr);
    tbl.appendChild(tbdy);
    body.appendChild(tbl);
}
function setupAddRowButton(){
    addRowButton = document.createElement("button");
    addRowButton.innerHTML = "+";
    addRowButton.onclick = function(){addRow();};
    addRowButton.id = "addRowButton";
}
class buttonData{
    constructor(y, x, button, number, id , color , vis){
        this.Y = y;
        this.X = x;
        this.Button = button;
        this.value = number;
        this.id = id;
        this.Color = color;
        this.Visible = vis;
    }
}
class colorStruct{
    constructor(def , clicked , background){
        this.Default = def;
        this.Clicked = clicked;
        this.Background = background;
    }
}

function buttonPress(clicked){
    if(clickCounter > 0){
        clickCounter--;
        buttonClicked[clickCounter] = ButtonDataMap[clicked].Button;
        buttonClicked[clickCounter].style.background = colors.Clicked;
        ButtonDataMap[clicked].Color = colors.Clicked;
        if(clickCounter == 0){
            if(buttonClicked[0] == buttonClicked[1]){
                clickCounter = 2;
                ButtonDataMap[clicked].Color = colors.Default;
                buttonClicked[1].style.background = colors.Default;
            }
            else if(checkValue() && checkPos()){
                buttonClicked[0].style.display = "none";
                buttonClicked[1].style.display = "none";
                ButtonDataMap[buttonClicked[0].id].Visible = false;
                ButtonDataMap[buttonClicked[1].id].Visible = false;
                NumbersOnBoard[ButtonDataMap[buttonClicked[0].id].Y*Xsize + ButtonDataMap[buttonClicked[0].id].X] = 0;
                NumbersOnBoard[ButtonDataMap[buttonClicked[1].id].Y*Xsize + ButtonDataMap[buttonClicked[1].id].X] = 0;
                buttonsLeft -= 2;
                clickCounter = 2;
                // GridsBOARD[ButtonDataMap[buttonClicked[0].id].Y][ButtonDataMap[buttonClicked[0].id].X].removeChild(buttonClicked[0]);
                // GridsBOARD[ButtonDataMap[buttonClicked[1].id].Y][ButtonDataMap[buttonClicked[1].id].X].removeChild(buttonClicked[1]);
                numberAliveInRow[ButtonDataMap[buttonClicked[0].id].Y]--;
                numberAliveInRow[ButtonDataMap[buttonClicked[1].id].Y]--;
                removeRow();
            }
            else{
                buttonClicked[0].style.background = colors.Default;
                buttonClicked[1].style.background = colors.Default;
                clickCounter = 2;
            }
        }
    }

}
function checkValue(){
    if(buttonClicked[0].value == buttonClicked[1].value || buttonClicked[1].value + buttonClicked[0].value == 10){
        return true;
    }
    return false;
}

function checkPos(){
    if(ButtonDataMap[buttonClicked[0].id].Y == ButtonDataMap[buttonClicked[1].id].Y){
        return sameRow();
    }
    else if(ButtonDataMap[buttonClicked[0].id].X == ButtonDataMap[buttonClicked[1].id].X){
        return sameCol();
    }
    else if(Math.abs(ButtonDataMap[buttonClicked[0].id].X - ButtonDataMap[buttonClicked[1].id].X) == Math.abs(ButtonDataMap[buttonClicked[0].id].Y - ButtonDataMap[buttonClicked[1].id].Y)){
        return equalDiagonaly();
    }
    else if(ButtonDataMap[buttonClicked[0].id].Y != ButtonDataMap[buttonClicked[1].id].Y){
        return equal_lineByLine();
    }
    return false;
}

function sameRow(){
    var left = (ButtonDataMap[buttonClicked[0].id].X < ButtonDataMap[buttonClicked[1].id].X)? ButtonDataMap[buttonClicked[0].id] : ButtonDataMap[buttonClicked[1].id];
    var right = (ButtonDataMap[buttonClicked[0].id].X > ButtonDataMap[buttonClicked[1].id].X)? ButtonDataMap[buttonClicked[0].id] : ButtonDataMap[buttonClicked[1].id];
    for(var i = left.X+1; i<right.X;i++){
        if(ButtonDataMap[BOARD[left.Y][i].id].Visible){
            return false;
        }
    }
    updateLastButtonCords(left,right);
    return true;
}
function sameCol(){
    var up = (ButtonDataMap[buttonClicked[0].id].Y<ButtonDataMap[buttonClicked[1].id].Y)? ButtonDataMap[buttonClicked[0].id] : ButtonDataMap[buttonClicked[1].id];
    var down = (ButtonDataMap[buttonClicked[0].id].Y>ButtonDataMap[buttonClicked[1].id].Y)? ButtonDataMap[buttonClicked[0].id] : ButtonDataMap[buttonClicked[1].id];
    for(var i = up.Y+1;i<down.Y;i++){
        if(ButtonDataMap[BOARD[i][up.X].id].Visible){
            return false;
        }
    }
    updateLastButtonCords(up,down);
    return true;
}

function equalDiagonaly(){
    var up = (ButtonDataMap[buttonClicked[0].id].Y < ButtonDataMap[buttonClicked[1].id].Y)? ButtonDataMap[buttonClicked[0].id]: ButtonDataMap[buttonClicked[1].id];
    var down = (ButtonDataMap[buttonClicked[0].id].Y > ButtonDataMap[buttonClicked[1].id].Y)? ButtonDataMap[buttonClicked[0].id] : ButtonDataMap[buttonClicked[1].id];
    var direction = (up.X < down.X)? 1:-1;
    var x = up.X + direction;
    for(var y = up.Y + 1 ; y<down.Y;y++){
        if(ButtonDataMap[BOARD[y][x].id].X == down.X){updateLastButtonCords(up,down);return true;}
        if(ButtonDataMap[BOARD[y][x].id].Visible){return false;}
        x += direction;
    }
    updateLastButtonCords(up,down);
    return true;
}

function equal_lineByLine(){
    var up = (ButtonDataMap[buttonClicked[0].id].Y < ButtonDataMap[buttonClicked[1].id].Y) ? ButtonDataMap[buttonClicked[0].id] : ButtonDataMap[buttonClicked[1].id];
    var down = (ButtonDataMap[buttonClicked[0].id].Y > ButtonDataMap[buttonClicked[1].id].Y) ? ButtonDataMap[buttonClicked[0].id] : ButtonDataMap[buttonClicked[1].id];
    var y = up.Y ;var x = up.X + 1;
    if(x == Xsize){
        y++;x=0;
    }
    for(var i = 0;i<(Xsize -1 - up.X)+ down.X ; i++){
        if(ButtonDataMap[BOARD[y][x].id].Visible){ // eror : Cant read property of undefind (reading id); buttons pos: first on the first row last col and the second on the second row sixth col
            return false;
        }
        x++;
        if(x == Xsize){
            y++; x=0;
        }
    }
    updateLastButtonCords(up,down);
    return true;
}
function updateLastButtonCords(back ,front){    
    if((back.Y == lastButtonCords[0] && back.X == lastButtonCords[1])||(front.Y == lastButtonCords[0] && front.X == lastButtonCords[1])){
        var flag = false;
        for(var i = front.Y ; i>0 ;i--){
            var t = ((i==front.Y)? front.X : 8)-1;
            for(var j = t; j>0 ; j--){
                if(ButtonDataMap[BOARD[i][j].id].Visible &&ButtonDataMap[BOARD[i][j].id] != back){
                    lastButtonCords[0] = i; lastButtonCords[1] = j;
                    flag = true;
                    break;
                }
            }
            if(flag){break;}
        }
    }
}
function addRow(){
    if(buttonsLeft*2 <Xsize*Ysize){
        var numbersToAdd = new Array(0);
        for(var i = 0;i<NumbersOnBoard.length;i++){
            if(NumbersOnBoard[i] != 0){
                numbersToAdd.push(NumbersOnBoard[i]);
            }
        }
        var y = lastButtonCords[0];var x = lastButtonCords[1];
        var revolution = buttonsLeft;
        for(var i = 0;i<revolution;i++){
            x++;
            if(x==9){
                y++;x=0;
            }
            if (BOARD[y][x] != null)
                GridsBOARD[y][x].removeChild(BOARD[y][x]);
            BOARD[y][x] = document.createElement("button");
            GridsBOARD[y][x].appendChild(BOARD[y][x]);
            value = numbersToAdd[i];
            createButton(y,x,value);
        }
    }
}
function rremoveRow(){
    var flag = false;
    for(var i = 0;i<numberAliveInRow.length-1;i++){
        if(numberAliveInRow[i] == 0){
            for(var j = 0;j<Xsize ;j++){
                if(i*Xsize + j > lastButtonCords[0]*Xsize + lastButtonCords[1]){
                    flag = true;
                    break;
                }
                GridsBOARD[i][j].removeChild(BOARD[i][j]);
                bringButtonUp(i , j);
            }
            if(i+1 == lastButtonCords[0]){ 
                lastButtonCords[0] --;
            }
            numberAliveInRow[i] = numberAliveInRow[i+1];
            numberAliveInRow[i+1] = 0;
        }
        if(flag){
            break;
        }
    }
    if(!isIn(numberAliveInRow , 0 , lastButtonCords[0])){
        for(var x = 0;x<Xsize;x++){

        }
    }
}
function bringRowUp(row, shouldRemoveChild){
    var flag = false;
    for(var x = 0;x<Xsize;x++){
        if(row*Xsize + x > lastButtonCords[0]*Xsize + lastButtonCords[1]){
            flag = true;
            break;
        }
        if(shouldRemoveChild)
            GridsBOARD[row][x].removeChild(BOARD[row][x]);
        bringButtonUp(row , x);
    }
    if(row+1 == lastButtonCords[0]){ 
        lastButtonCords[0] --;
    }
    numberAliveInRow[row] = numberAliveInRow[row+1];
    numberAliveInRow[row+1] = 0;
    return flag;
}

function removeRow(){
    var empty = new Array(0);
    var y = 0;

    if(numberAliveInRow[ButtonDataMap[buttonClicked[0].id].Y] == 0){
        empty.push(ButtonDataMap[buttonClicked[0].id].Y)
    }

    if(numberAliveInRow[ButtonDataMap[buttonClicked[1].id].Y] == 0){
        empty.push(ButtonDataMap[buttonClicked[1].id].Y)
    }
    for(var i = 0;i<empty.length;i++){
        y = empty[i];
        bringRowUp(y, true)
        // for(var x = 0;x<Xsize;x++){
        //     if(y*Xsize + x > lastButtonCords[0]*Xsize + lastButtonCords[1]){
        //         break;
        //     }
        //     GridsBOARD[y][x].removeChild(BOARD[y][x]);
        //     bringButtonUp(y , x);
        // }
        // if(y+1 == lastButtonCords[0]){ 
        //     lastButtonCords[0] --;
        // }
        // numberAliveInRow[y] = numberAliveInRow[y+1];
        // numberAliveInRow[y+1] = 0;
        var flag = false;
        for(var w = y+1;w<lastButtonCords[0]+1;w++){
            flag = bringRowUp(w, false)
            // for(var v = 0;v<Xsize;v++){
            //     if(w*Xsize + v > lastButtonCords[0]*Xsize + lastButtonCords[1]){
            //         flag = true;
            //         break;
            //     }
            //     bringButtonUp(y,x);
            // }
            // if(w+1 == lastButtonCords[0]){ 
            //     lastButtonCords[0] --;
            // }
            // numberAliveInRow[w] = numberAliveInRow[w+1];
            // numberAliveInRow[w+1] = 0;
            if(flag){
                break;
            }
        }
    }

}
function bringButtonUp(y ,x){
    BOARD[y][x] = BOARD[y+1][x];
    BOARD[y+1][x] = null;
    GridsBOARD[y+1][x].removeChild(BOARD[y][x]);
    GridsBOARD[y][x].appendChild(BOARD[y][x]);
    BOARD[y][x].id = "button"+(y*Xsize +x);
    ButtonDataMap[BOARD[y][x].id].Button = BOARD[y][x];
}

function isIn(lst , v, limit){
    for(var i = 0;i<lst.length;i++){
        if(limit == i){
            return false;
        }
        if(lst[i] == v){
            return true;
        }
    }
    return false;
}