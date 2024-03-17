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
var score =  0;
var scoreBoard;
var addRowClicks = 5;
var addRowClicksArea;
function setup(){
    for(var i = 0;i<Ysize;i++){numberAliveInRow[i] = 0;}
    colors = new colorStruct("#a8a3a3" , "#54de10" , "#c2bcbc");
    document.body.style.background = colors.Background;
    setUpFunctionalityArea();
    createGrid();
    setupCSS();
    for(var i= 0;i<heigthestNumber+1;i++){NumbersAlive[i] = i;}
    for(var i = 0;i<Ysize;i++){
        for(var j = 0;j<Xsize;j++){
            value = Math.floor(Math.random()*heigthestNumber+1);
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
                td.appendChild(scoreBoard);
                td.appendChild(addRowClicksArea);
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
function setUpFunctionalityArea(){
    setupAddRowButton();
    AddRowClicks()
    setUpScoreBoard();
}
function setupAddRowButton(){
    addRowButton = document.createElement("button");
    addRowButton.innerHTML = "+";
    addRowButton.onclick = function(){addRow();};
    addRowButton.id = "addRowButton";
}
function AddRowClicks(){
    addRowClicksArea = document.createElement("p");
    addRowClicksArea.innerHTML = addRowClicks;
    addRowClicksArea.id = "addRowClicks";
}
function setUpScoreBoard(){
    scoreBoard = document.createElement("p");
    scoreBoard.innerHTML = score;
    scoreBoard.id = "scoreBoard";
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
                numberAliveInRow[ButtonDataMap[buttonClicked[0].id].Y]--;
                numberAliveInRow[ButtonDataMap[buttonClicked[1].id].Y]--;
                if(buttonsLeft >0){
                    removeRow();
                }
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
    var button1 = ButtonDataMap[buttonClicked[0].id];
    var button2 = ButtonDataMap[buttonClicked[1].id];
    if(button1.value == button2.value || button1.value + button2.value == 10){
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
    score += 2;
    scoreBoard.innerHTML = score;
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
    score += 2;
    scoreBoard.innerHTML = score;
    updateLastButtonCords(up,down);
    return true;
}

function equalDiagonaly(){
    var up = (ButtonDataMap[buttonClicked[0].id].Y < ButtonDataMap[buttonClicked[1].id].Y)? ButtonDataMap[buttonClicked[0].id]: ButtonDataMap[buttonClicked[1].id];
    var down = (ButtonDataMap[buttonClicked[0].id].Y > ButtonDataMap[buttonClicked[1].id].Y)? ButtonDataMap[buttonClicked[0].id] : ButtonDataMap[buttonClicked[1].id];
    var direction = (up.X < down.X)? 1:-1;
    var x = up.X + direction;
    for(var y = up.Y + 1 ; y<down.Y;y++){
        if(ButtonDataMap[BOARD[y][x].id].X == down.X){
            score += 2;
            scoreBoard.innerHTML = score;
            updateLastButtonCords(up,down);
            return true;
        }
        if(ButtonDataMap[BOARD[y][x].id].Visible){return false;}
        x += direction;
    }
    score += 2;
    scoreBoard.innerHTML = score;
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
    score += 2;
    scoreBoard.innerHTML = score;
    updateLastButtonCords(up,down);
    return true;
}
function updateLastButtonCords(back ,front){   
    BOARD[lastButtonCords[0]][lastButtonCords[1]].style.background = "a8a3a3" 
    if((back.Y == lastButtonCords[0] && back.X == lastButtonCords[1])||(front.Y == lastButtonCords[0] && front.X == lastButtonCords[1])){
        var flag = false;
        for(var i = front.Y ; i>=0 ;i--){
            var t = ((i==front.Y)? front.X : Xsize)-1;
            for(var j = t; j>=0 ; j--){
                if(ButtonDataMap[BOARD[i][j].id].Visible &&ButtonDataMap[BOARD[i][j].id] != back){
                    lastButtonCords[0] = i; lastButtonCords[1] = j;
                    flag = true;
                    BOARD[lastButtonCords[0]][lastButtonCords[1]].style.background = "blue";
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
function bringRowUp(row, shouldRemoveChild){
    if(row+1 >= lastButtonCords[0] && !shouldRemoveChild){ 
        lastButtonCords[0] --;
    }
    var first = 0
    for(var i = 0;i<9;i++){
        if(ButtonDataMap[BOARD[row][i].id].Visible){
            first = i;
            break;
        }
    }
    var flag = false;
    for(var x = first;x<Xsize;x++){
        if(row*Xsize + x > lastButtonCords[0]*Xsize + lastButtonCords[1]){
            flag = true;
            break;
        }
        if(shouldRemoveChild)
            GridsBOARD[row][x].removeChild(BOARD[row][x]);
        if(numberAliveInRow[row+1] != 0){
            bringButtonUp(row , x);
        }

    }
    if(row+1 >= lastButtonCords[0] && shouldRemoveChild){ 
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

    if(numberAliveInRow[ButtonDataMap[buttonClicked[1].id].Y] == 0 && numberAliveInRow[ButtonDataMap[buttonClicked[1].id].Y] != numberAliveInRow[ButtonDataMap[buttonClicked[0].id].Y]){
        empty.push(ButtonDataMap[buttonClicked[1].id].Y)
    }
    empty.sort((a,b) => b - a);
    for(var i = 0;i<empty.length;i++){
        y = empty[i];
        bringRowUp(y, true)
        var flag = false;
        for(var w = y+1;w<lastButtonCords[0]+1;w++){
            flag = bringRowUp(w, false)
            if(flag){
                break;
            }
        }
    }
    if(empty.length > 0){
        score += 2;
        scoreBoard.innerHTML = score;
    }
}
function bringButtonUp(y ,x){
    var value = ButtonDataMap[BOARD[y+1][x].id].value;
    BOARD[y][x] = BOARD[y+1][x];
    BOARD[y+1][x] = null;
    GridsBOARD[y+1][x].removeChild(BOARD[y][x]);
    GridsBOARD[y][x].appendChild(BOARD[y][x]);
    BOARD[y][x].id = "button"+(y*Xsize +x);
    ButtonDataMap[BOARD[y][x].id].Button = BOARD[y][x];
    ButtonDataMap[BOARD[y][x].id].Visible = true;
    ButtonDataMap[BOARD[y][x].id].value = value;
}