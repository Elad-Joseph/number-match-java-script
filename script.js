var Ysize = 10; // the maximum row in the board
var Xsize = 9;  // the maximum numbers in a row
var BOARD = Array.from(Array(Ysize), () => new Array(Xsize));
var ButtonDataMap = {};
var VisbuttonsInStart = 27;
var buttonSize = 100;
var buttonClicked = new Array(2);
var clickCounter = 2;
var colors;
function setup(){
    colors = new colorStruct("#a8a3a3" , "#54de10" , "#c2bcbc");
    document.body.style.background = colors.Background;
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
    BOARD[y][x].setAttribute('style', 'top:'+y*buttonSize+'px;left:'+x*buttonSize+'px;position: absolute;width:'+buttonSize+'px;height:'+buttonSize+'px;background:'+colors.Default+';');
    BOARD[y][x].onclick = function(){buttonPress(this.id)};
    value = Math.floor(Math.random()*9+1);
    BOARD[y][x].innerHTML = value;
    ButtonDataMap[BOARD[y][x].id] = new buttonData(y,x,BOARD[y][x],value , BOARD[y][x].id , colors.Default);
    document.body.appendChild(BOARD[y][x]);
}

class buttonData{
    constructor(y, x, button, number, id , color){
        this.Y = y;
        this.X = x;
        this.Button = button;
        this.value = number;
        this.id = id;
        this.Color = color;
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
                clickCounter = 2
                ButtonDataMap[clicked].Color = colors.Default;
                buttonClicked[1].style.background = colors.Default;
            }
            else if(checkValue()){

            }
            
        }
    }

}

function checkValue(){
    if(buttonClicked[0].value == buttonClicked[1] || buttonClicked[1] + buttonClicked[0] == 10){
        return true;
    }
    return false;
}

function checkPos(){
    
}