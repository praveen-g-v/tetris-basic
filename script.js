document.addEventListener("DOMContentLoaded",()=>{
    const grid=document.querySelector('.grid');
    let squares=Array.from(document.querySelectorAll('.grid div'));
    const width=10;
    const displayScore=document.querySelector('#score');
    //console.log(squares);
    const startbtn=document.querySelector('#startbtn')
    let nextRandom=0;
    let timerId;
    let score=0;

    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
      ];
    
      const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
      ];

      const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
      ];
    
      const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
      ];
    
      const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
      ];
    
    
    
    
      
      let currentpos=4;
      let currentrotation=0;
      const tetrominoes=[lTetromino,zTetromino,tTetromino,oTetromino,iTetromino];

      let random=Math.floor((Math.random())*5);
      
      let current=tetrominoes[random][currentrotation];

      //drawing the tetrominoe

      function draw() {
          current.forEach(index =>{
            squares[currentpos + index].classList.add('tetrimonio')

          });
      }

      
      function undraw() {
        current.forEach(index =>{
          squares[currentpos + index].classList.remove('tetrimonio')
 
        });
      }


      //conrols of the tetrimonioes
      
      function control(e) {
        if(e.keyCode ==37||e.keyCode==65){
          moveLeft();
        }
        else if(e.keyCode == 38 || e.keyCode ==87){
          rotate();
        }
        else if(e.keyCode == 39 || e.keyCode ==68){
           moveRight();
        }
        else if(e.keyCode == 40 || e.keyCode ==83){
          moveDown();
        }
      }
      document.addEventListener('keyup',control);









    //moving the tetrimonio

    function moveDown() {
        undraw();
        currentpos+=width;
        draw();
        freeze();
    }

    // timerId=setInterval(moveDown, 1000); 




    //freeze function

    function freeze(){
      if(current.some(index=> squares[currentpos+index+width].classList.contains('taken'))){
        current.forEach(index =>squares[currentpos+index].classList.add('taken'));
        //starting a new tetrominoes to fall
        random=nextRandom;
        nextRandom=Math.floor(Math.random()*5);
        current=tetrominoes[random][currentrotation];
        currentpos=4;
        draw();
        displayShape();
        addScore();
        gameOver();
      }
    }

    //tetrimonoe movements
    function moveLeft() {
      undraw();
      const isAtLeftEdge=current.some(index =>(currentpos+index)%width==0);
      if(!isAtLeftEdge){
        currentpos-=1;
      }
      if(current.some(index=> squares[currentpos+index].classList.contains('taken'))){
        currentpos+=1;
      }
      draw();

    }


    function moveRight() {
      undraw();
      const isAtRightEdge=current.some(index =>(currentpos+index)%width==width-1);
      if(!isAtRightEdge){
        currentpos+=1;
      }
      if(current.some(index=> squares[currentpos+index].classList.contains('taken'))){
        currentpos-=1;
      }
      draw();

    }




    function rotate() {
      undraw();
      currentrotation++;
      if(currentrotation==4){
        currentrotation=0;
      }
      current=tetrominoes[random][currentrotation];
      draw();
    }



//next tetromino shower in mini grid
const displaySquares=document.querySelectorAll(".miniGrid div")
const displayWidth=4;
let displayIndex=0;



// showing the tetrimoino without the rotation
const upNextTetrominoes = [
  [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
  [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
  [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
  [0, 1, displayWidth, displayWidth+1], //oTetromino
  [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
]

//displaying the sapes in mini grid
function displayShape() {
//removing the traces of previous tetrominoes
  displaySquares.forEach(squares=>{
    squares.classList.remove('tetrimonio')
  })
  upNextTetrominoes[nextRandom].forEach(index =>{
    displaySquares[displayIndex+index].classList.add('tetrimonio')
  })
}

//adding functionalities to the button

startbtn.addEventListener('click',()=>{
  if(timerId){
    clearInterval(timerId)
    timerId=null
  }
  else{
    draw();
    timerId=setInterval(moveDown,1000);
    nextRandom=Math.floor(Math.random()*5);
    displayShape();
    
  }
})

//ading scores in the display squares

function addScore() {
  for (let i = 0; i < 199; i+=width) {
    const row=[i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9];

    if(row.every(index => squares[index].classList.contains('taken'))){
      score+=10;
      displayScore.innerHTML=score;
      row.forEach(index =>{
        squares[index].classList.remove('taken')
        squares[index].classList.remove('tetrimonio')
      })
      const squaresRemoved=squares.splice(i,width);
      squares=squaresRemoved.concat(squares);
      squares.forEach(cell => grid.appendChild(cell))
    }
    
  }
}

//game Over
function gameOver() {
  if(current.some(index=>squares[currentpos+index].classList.contains('taken'))){
    displayScore.innerHTML="Ended  "+score;
    clearInterval(timerId);
  }
}

    
})