var Ysize = 10; // the maximum row in the board
var Xsize = 9;  // the maximum numbers in a row
var BOARD = Array.from(Array(Ysize), () => new Array(Xsize));
var GridsBOARD = Array.from(Array(Ysize), () => new Array(Xsize));
var ButtonDataMap = {};
var VisbuttonsInStart = 27;
var buttonSize = 100;
var heigthestNumber = 9;
var buttonClicked = new Array(2);
var clickCounter = 2;
var colors;
var lastButtonCords = [0,0];
var buttonsLeft = 0;
var NumbersAlive = new Array(heigthestNumber+1)
function setup(){
    colors = new colorStruct("#a8a3a3" , "#54de10" , "#c2bcbc");
    document.body.style.background = colors.Background;
    createGrid();
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
    // TODO: add a way to change css variables
}

function createButton(y ,x ,value){
    BOARD[y][x].className = "game_button";
    BOARD[y][x].id = "button" + (y*Xsize+x);
    BOARD[y][x].onclick = function(){buttonPress(this.id)};
    BOARD[y][x].innerHTML = value;
    ButtonDataMap[BOARD[y][x].id] = new buttonData(y,x,BOARD[y][x],value , BOARD[y][x].id , colors.Default , true);
    buttonsLeft++;
}
function createGrid(){
    var body = document.getElementsByTagName('body')[0];
    var tbl = document.createElement('table');
    var tbdy = document.createElement('tbody');
    for (var i = 0; i < Ysize; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < Xsize; j++) {
            var td = document.createElement('td');
            GridsBOARD[i][j] = td;
            if(i*Xsize+j < VisbuttonsInStart){
                BOARD[i][j] = document.createElement("button");
                td.appendChild(BOARD[i][j]);
            }
            tr.appendChild(td);
        }
    tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl);
}
function createFunctionalityArea(){
    AddRowButton();
}
function AddRowButton(){

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
                buttonClicked[0].style.visibility = "hidden";
                buttonClicked[1].style.visibility = "hidden";
                ButtonDataMap[buttonClicked[0].id].Visible = false;
                ButtonDataMap[buttonClicked[1].id].Visible = false;
                buttonsLeft -= 2;
                clickCounter = 2;
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
    for(var y = Math.abs(up.Y-down.Y)-1 ; y<down.Y;y++){
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
    for(var i = 0;i<(Xsize -1 - up.X)+ down.X ; i++){
        if(ButtonDataMap[BOARD[y][x].id].Visible){
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
        lastButtonCords[1] = (lastButtonCords[1]-1 <0)? 8:lastButtonCords[1]-1; // position the lastbuttoncords one cell in front of the last one
    }
}
var numbersToAdd = new Array(0);
function addRow(){
    for(var i = 0;i<heigthestNumber+1;i++){
        if(NumbersAlive[i] != 0){
            numbersToAdd.push(NumbersAlive[i]);
        }
    }
    for(var i = lastButtonCords[0];i<Math.floor((buttonsLeft+lastButtonCords[1])/Xsize)+Math;i++){
        for(var j = (i==lastButtonCords[0])?lastButtonCords[1]:0;j<Xsize;j++){
            BOARD[i][j].createElement("button");
            GridsBOARD[i][j].appendChild(BOARD[i][j]);
            value = randomValue();
            createButton(i,j,value);
        }
    }
}

function randomValue(){
    var rd = Math.floor(Math.random()*numbersToAdd.length-1);
    var value = rd;
    numbersToAdd[rd] --;
    if(numbersToAdd[rd]<1){
        numbersToAdd.splice(rd,1);
    }
    return value;
}