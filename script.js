var Ysize = 10; // the maximum row in the board
var Xsize = 9;  // the maximum numbers in a row
var BOARD = Array.from(Array(Ysize), () => new Array(Xsize));
var ButtonDataMap = {};
var VisbuttonsInStart = 27;
var buttonSize = 100;
function setup(){
    for(var i = 0;i<Ysize;i++){
        for(var j = 0;j<Xsize;j++){
            createButton(i,j);
            if(!(i*Xsize+j < VisbuttonsInStart-1)){
                return 0;
            }
        }
    }
}

function createButton(y,x){
    BOARD[y][x] = document.createElement("button")
    BOARD[y][x].className = "button";
    BOARD[y][x].id = "button" + (y*Xsize+x);
    BOARD[y][x].setAttribute('style', 'top:'+y*buttonSize+'px;left:'+x*buttonSize+'px;position: absolute;width:'+buttonSize+'px;height:'+buttonSize+'px;');
    BOARD[y][x].addEventListener("click", buttonPress());
    value = Math.floor(Math.random()*9+1);
    BOARD[y][x].innerHTML = value;
    ButtonDataMap[BOARD[y][x]] = new buttonData(y,x,BOARD[y][x],value , BOARD[y][x].id);
    document.body.appendChild(BOARD[y][x]);
}

class buttonData{
    constructor(y, x, Button, number, id){
        this.Y = y;
        this.X = x;
        this.button = Button;
        this.value = number;
        this.id = id
    }
}
function buttonPress(){
    alert("hi");
}