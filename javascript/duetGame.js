
var mouseDownX = null, mouseDownY = null;

var canvas = document.querySelector('canvas'); 
canvas.height = window.innerHeight; 
var c = canvas.getContext('2d');

var score = 0;
var rank = 0;



var bgBtn = document.getElementById('bgBtn');
var normBtn = document.getElementById('normBtn');
var hackBtn = document.getElementById('hackBtn');
var table = document.getElementById('cont');


bgBtn.style.display = "none";
normBtn.style.display = "none";
hackBtn.style.display = "none";
table.style.display = "inline";
document.getElementById('button').style.display = 'inline';
var scoreTab = document.getElementById('scoreTable');



function randomIntFromRange(min,max){
	return Math.floor(Math.random()*(max-min+1)+min);
}


function clearLS()
{
	TotalTrials = scoreTab.rows.length;
	 for(var i=1; i<TotalTrials; i++)
    {
    	localStorage.removeItem('s'+i);
    	localStorage.removeItem('r'+i);
    }
    document.location.reload();
}

function clamp(min, max, value, radius){
	if(value<min)
	{
		if(min-value < radius)
    {
      return 1;
    }
    else {
      return 0;
    }
	}
    
    else if(value>max)
    {
    	if(value-max < radius)
    {
      return 1;
    }
    else {
      return 0;
    }
    }

    else
    {
    	return 1;
    }

}


class Circle
{
	constructor(x,y,radius)
	{
		this.x = x;
		this.y = y;
		this.radius = radius
	}
	draw()
	{
	   c.beginPath();
       c.arc(this.x,this.y,this.radius,0,Math.PI * 2,true);
       c.StrokeStyle = 'black';
       c.stroke();
       c.closePath(); 	
	}

}

class MiniDuet{
	constructor(x,y,dx,dy,radius,color)
	{
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.radius = radius;
		this.color = color;
		this.ttl = 100; //time to live
	}

	draw()
	{
	  	c.beginPath();
    	c.arc(this.x,this.y,this.radius,0,Math.PI * 2,true);
    	c.fillStyle = this.color;
    	c.fill();
    	c.closePath();
	}

	update()
	{
		this.x +=this.dx;
        this.y +=this.dy;
        this.ttl -=1;
        this.draw();
	}
}

class Duet
{
	constructor(x,y,radians,color,radius)
	{
		this.radians = radians;
		this.x = x + Math.cos(this.radians)*50;
	    this.y = y;
	    this.radius = radius;
		this.color = color;
		this.velocity = 0.1;
		this.centerX = x;
		this.centerY = y;
	}

	draw()
	{
	   c.beginPath();
	   c.fillStyle = this.color;
       c.arc(this.x,this.y,this.radius,0,Math.PI * 2,true);
       c.fill();
       c.closePath(); 	
	}	

	clockwiseRotate()
	{
		this.radians +=this.velocity;
        this.x = this.centerX + Math.cos(this.radians)*50;
        this.y = this.centerY + Math.sin(this.radians)*50; 
	}

	AnticlockwiseRotate()
	{
		this.radians -=this.velocity;
        this.x = this.centerX + Math.cos(this.radians)*50;
        this.y = this.centerY + Math.sin(this.radians)*50;
	}
    
    shatter(){
     
     this.radius = 0;
    
   	 for(let i=0; i<2; i++)
   		{
   	  		var dx = randomIntFromRange(-2,2);
   	   		var dy = randomIntFromRange(-5,5);
       		miniDuets.push(new MiniDuet(this.x, this.y,dx,dy,2,this.color));
   		}

     }
	
}

class Obstacle
{
	constructor(x,y,velocity)
	{
		this.x = x;
		this.y = y;
		this.velocity = velocity;
	}

	draw()
	{
		c.beginPath();
		c.fillStyle = 'purple';
        c.fillRect(this.x,this.y, 150, 30);
        c.fill();
        c.closePath();

	}

	update()
	{
		this.y = this.y + this.velocity;
		this.collisionDetection();

		this.draw();
	}

	collisionDetection()
	{
		if((clamp(this.x,(this.x+150),redDuet.x,15) && clamp(this.y,(this.y+30),redDuet.y,15)))
   		{
      	   	redDuet.shatter();
   		}
   		
   		if((clamp(this.x,(this.x+150),blueDuet.x,15) && clamp(this.y,(this.y+30),blueDuet.y,15)))
   		{
      	    blueDuet.shatter();
      	   	
   		}
   		
	}

}


function ObstacleRelease(maxTime,maxSpeed){

	
	timerObs = setInterval(function(){

    x = randomIntFromRange(50, canvas.width-200);
    //if rectangle is exactly between 100-250 then it will block the circle itself 
	if(x>=100 && x<=175)
	{
		x = 100; 
	}

	else if(x>175 && x<=250)
	{
        x = 250;
	}

	obstacleArray.push(new Obstacle(x,-30,maxSpeed));
	//score = score + 5;

	if(obstacleArray.length > 7) //after 8 obs increase speed
	{
		obstacleArray.splice(0,5);
		SpeedIncrease();
	}
	

	}, maxTime);

   }



function SpeedIncrease()
{
	clearInterval(timerObs);
	speed = speed + 0.5;
	time = 6000/speed;
	if(speed>=10)
	{
		speed = 10;
	}
    if(time<=600)
    {
    	time = 600;
    }
	ObstacleRelease(time,speed);

}

function ScoreIncrease()
{
	timerScore = setInterval(function(){
        score = score + 1;
		document.getElementById('score'+ rank).innerHTML = score;
		localStorage.setItem('s'+ rank,score);
		moveAboveTable();

	}, 1000);
}

function moveAboveTable()
{
	
    var numTrial = scoreTab.rows.length - 1;
	if(numTrial>=2)
	{
       if(rank!=1)
       {


        var nowRow = document.getElementById('row'+rank);
		var aboveRow = document.getElementById('row'+(rank-1));
		var aboveScore = aboveRow.cells[1].childNodes[0].innerHTML;
		/*console.log(rank);
		console.log(scoreTab);
		console.log(nowRow);
		console.log(aboveRow);
		console.log('score' + score);
        console.log('aboveScore' + aboveScore);*/

	   while(score >= aboveScore)
	   {

          	var rPres =  nowRow.cells[0].childNodes[0].innerHTML;
          	var rTop =  aboveRow.cells[0].childNodes[0].innerHTML;
          	var sPres= score;
          	var sTop = aboveScore;
            
            rank = rank - 1;
          localStorage.setItem('s'+ rank,sPres);
          localStorage.setItem('s'+ (rank+1),sTop);

          localStorage.setItem('r'+ rank,rPres);
          localStorage.setItem('r'+ (rank+1),rTop);

        
          nowRow.cells[0].childNodes[0].innerHTML = localStorage.getItem('r'+ (rank+1));
          aboveRow.cells[0].childNodes[0].innerHTML = localStorage.getItem('r'+ (rank));

          nowRow.cells[1].childNodes[0].innerHTML = localStorage.getItem('s'+ (rank+1));
          aboveRow.cells[1].childNodes[0].innerHTML = localStorage.getItem('s'+ (rank));

          if(rank == 1)
          {
          	break;
          }

          nowRow = document.getElementById('row'+rank);
		  aboveRow = document.getElementById('row'+(rank-1));
		  aboveScore = aboveRow.cells[1].childNodes[0].innerHTML;
            
            console.log('rank'+rank); 
	     }
	   }
     }
   }

function displayTable()
{
	var a=1;
	var rowExist = localStorage.getItem('r'+ a);
	while(rowExist)
	{
        var rowCnt = scoreTab.rows.length;        
        var tr = scoreTab.insertRow(rowCnt);     
        tr.id = 'row'+rowCnt;

        for (var c = 0; c < arrHead.length; c++) {
            var td = document.createElement('td');          
            td = tr.insertCell(c);

            if (c == 0) {  

            	var element = document.createElement('p');
                index = scoreTab.rows.length - 1;
                element.innerHTML = localStorage.getItem('r'+ a);

                td.appendChild(element);
                
            }
            else if (c==1) {
            	var element = document.createElement('p');
               
                element.innerHTML = localStorage.getItem('s'+ a);
                element.id = 'score'+ (scoreTab.rows.length - 1);
                td.appendChild(element);
               }
        }

        a = a+1;
        rowExist = localStorage.getItem('r'+ a);
	}
}

function addRow() {
        
        var rowCnt = scoreTab.rows.length;        
        var tr = scoreTab.insertRow(rowCnt);      
        tr.id = "row"+rowCnt;

        for (var c = 0; c < arrHead.length; c++) {
            var td = document.createElement('td');          
            td = tr.insertCell(c);

            if (c == 0) {  

            	var element = document.createElement('p');
                index = scoreTab.rows.length - 1;
                element.innerHTML = 'Trial '+ index;

                td.appendChild(element);
               
                
            }
            else if (c==1) {
            	var element = document.createElement('p');
               
                element.innerHTML = score;
                element.id = 'score'+ (scoreTab.rows.length - 1);
                td.appendChild(element);
               
            }
        }

        rank = scoreTab.rows.length - 1;
        localStorage.setItem('s'+ (scoreTab.rows.length - 1),score);
        localStorage.setItem('r'+ (scoreTab.rows.length - 1),'Trial '+(scoreTab.rows.length - 1));



    }

let redDuet;
let blueDuet;
let circle;
let obstacleArray = []
let speed = 2;
let time = 3000;
let miniDuets 


function initialize(){

	obstacleArray = []
	miniDuets = []
	
	canvas.onmousedown = myMouseDown;
    canvas.onmouseup = myMouseUp;

	circle = new Circle(canvas.width/2,canvas.height - 100,50);
    circle.draw();

    redDuet = new Duet(canvas.width/2,canvas.height - 100,0,'red',15);
    redDuet.draw();
    blueDuet = new Duet(canvas.width/2,canvas.height - 100,Math.PI,'blue',15);
    blueDuet.draw();

    ObstacleRelease(time,speed);
    displayTable();
    addRow();
    ScoreIncrease();

    
}



function myMouseDown(e){

	timerDuet = setInterval(function(){
	mouseDownX = e.offsetX;  
	mouseDownY = e.offsetY; 
	
	if(mouseDownX > canvas.width/2)
	{
		redDuet.clockwiseRotate();
		blueDuet.clockwiseRotate();
	}
	else if(mouseDownX < canvas.width/2) 
	{
		redDuet.AnticlockwiseRotate();
		blueDuet.AnticlockwiseRotate();
	}

	}, 20);
}


function myMouseUp(e)
{
	clearInterval(timerDuet);
}

function gameOver()
	{
		
		clearInterval(timerScore);
		timerScore = null;
		setJS('tryAgainGame.js');
		
	}


function gameloop(){
	
  	c.clearRect(0,0,canvas.width,canvas.height); 

  	obstacleArray.forEach(obstacle => {
       
        obstacle.update();

    });

    circle.draw();
 	redDuet.draw();
 	blueDuet.draw(); 

    miniDuets.forEach((miniDuet,index) => {
  		miniDuet.update();
  		if(miniDuet.ttl == 0)
  		{
  			miniDuets.splice(index,1);
  			gameOver();
  		}
  	})
    
    c.font = 'bold 35px Open Sans';
    c.fillStyle = 'black';
	c.textAlign = 'center';
	c.fillText('Score: ' + score,350,100);


    requestAnimationFrame(gameloop);
}


initialize();
gameloop();
