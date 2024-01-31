var Ysize = 10; // the maximum row in the board
var Xsize = 9;  // the maximum numbers in a row
var BOARD = Array.from(Array(Ysize), () => new Array(Xsize));
var ButtonDataMap = {};
var VisbuttonsInStart = 27;
var yakov = 100; // hello this is yakov and he's in charge on keeping the size of buttons in order
for(var i = 0;i<Ysize;i++){
    for(var j = 0;j<Xsize;j++){
        createButton(i,j);
        if(!(i*Xsize+j < VisbuttonsInStart)){
            break;
        }
    }
}
// createBoard()
function createButton(y,x){
    BOARD[y][x] = document.createElement("button")
    BOARD[y][x].id = "button"+y*Xsize+x;
    Board[y][x].setAttribute('style', 'top:'+i*yakov+'px;left:'+j*yakov+'px;');
    value = Math.floor(Math.random()*10);
    BOARD[y][x].value = value;
    ButtonDataMap[BOARD[y][x]] = buttonData(y,x,BOARD[y][x],value , BOARD[y][x].id);
}
// function createBoard(){
//     for(var i = 0;i<Ysize;i++){
//         for(var j = 0;j<Xsize;j++){
//             if(!(i*Xsize + j < VisbuttonsInStart)){break}
//             BOARD[i][j].value = Math.floor(Math.random()*10);

//         }
//     }
// }
class buttonData{
    constructor(y, x, Button, number, id){
        this.Y = y;
        this.X = x;
        this.button = Button;
        this.value = number;
        this.id = id
    }
}