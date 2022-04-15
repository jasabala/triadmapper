function cloneCanvas() {
    //create a new canvas for drawing
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');

    //set dimensions
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
	context.fillStyle = "#cac8c5"
	context.fillRect(0,0,newCanvas.width, newCanvas.height)
	
    //apply the old canvas to the new one
	context.drawImage(backCanvas, 0, 0);
    context.drawImage(canvas, 0, 0);
	context.drawImage(chordCanvas, 0, 0);
	var link = document.createElement('a');
	link.download = 'triads.png';
	link.href = newCanvas.toDataURL()
	link.click()
}


function highLightSet(start, num){
	num = num-1
	ctx.fillStyle = "orange"
	ctx.globalAlpha = .1
	boards.forEach(board =>{
		ctx.fillRect(board.x+protoBoard.stringSpace*(stringNotes[document.getElementById("tuning").value].length-start) ,board.y,-1*protoBoard.stringSpace*num,protoBoard.height)	
	})
	ctx.globalAlpha = 1	
}


function fullTriadSetMajor(key, set){	
	let scale = getScale(key,0,0)
	keyChooser.selectedIndex = chromaticScale.indexOf(key);
	refreshScale()
	highLightSet(set,3)
	scale.pop()
	scale.forEach( (note, index) => {
		if( [0,3,4].indexOf(scale.indexOf(note)) > -1 ){
			sketchMajorTriad(boards[index],set, note, 0, "red")
			sketchMajorTriad(boards[index],set, note, 1, "blue")
			sketchMajorTriad(boards[index],set, note, 2, "purple")				
		}else if(scale.indexOf(note) === 6 ){
			sketchDimChord(boards[index],set, note, 0, "red")
			sketchDimChord(boards[index],set, note, 1, "blue")
			sketchDimChord(boards[index],set, note, 2, "purple")				
		}else{			
			sketchMinorTriad(boards[index],set, note, 0, "red")
			sketchMinorTriad(boards[index],set, note, 1, "blue")
			sketchMinorTriad(boards[index],set, note, 2, "purple")					
		}				
	})
	ctx.font = 'bold 70px serif';
	ctx.fillStyle = "#3e4444";
	ctx.fillText(`${scale[0]} Major - Triads on Strings ${set}, ${set+1}, ${set+2}`, canvas.width/2, 50)
	ctx.fillStyle = "#3e4444";
	ctx.font = 'bold 50px serif';
	labels = [`${scale[0]} (I)`, `${scale[1]}m (ii)`, `${scale[2]}m (iii)`, `${scale[3]} (IV)`, `${scale[4]} (V)`, `${scale[5]}m (vi)`, `${scale[6]}\xB0 (vii)`]
	labels.forEach((label, index) => {
		ctx.font = 'bold 50px serif';
			ctx.fillText(label, boards[index].x+protoBoard.width/2, 200)		
	}) 

	ctx.font = 'bold 25px serif';
	ctx.fillStyle = "red";
	ctx.fillText("root position (1,3,5)", canvas.width/10, 50)
	ctx.fillStyle = "purple" ;
	ctx.fillText("1st inversion (3,5,1)", canvas.width/10, 80)
	ctx.fillStyle = "blue";
	ctx.fillText("2nd inversion  (5,1,3)", canvas.width/10, 110)	
}
function fullTriadSetMinor(key, set){	
	let scale = getScale(key,1,0)
	keyChooser.selectedIndex = chromaticScale.indexOf(key);
	refreshScale()
	highLightSet(set,3)
	scale.pop()
	scale.forEach( (note, index) => {
		if( [2,5,6].indexOf(scale.indexOf(note)) > -1 ){
			sketchMajorTriad(boards[index],set, note, 0, "red")
			sketchMajorTriad(boards[index],set, note, 1, "blue")
			sketchMajorTriad(boards[index],set, note, 2, "purple")				
		}else if(scale.indexOf(note) === 1 ){
			sketchDimChord(boards[index],set, note, 0, "red")
			sketchDimChord(boards[index],set, note, 1, "blue")
			sketchDimChord(boards[index],set, note, 2, "purple")				
		}else{			
			sketchMinorTriad(boards[index],set, note, 0, "red")
			sketchMinorTriad(boards[index],set, note, 1, "blue")
			sketchMinorTriad(boards[index],set, note, 2, "purple")					
		}				
	})
	ctx.font = 'bold 70px serif';
	ctx.fillStyle = "#3e4444";
	ctx.fillText(`${scale[0]} Minor - Triads on Strings ${set}, ${set+1}, ${set+2}`, canvas.width/2, 50)
	ctx.fillStyle = "#3e4444";
	ctx.font = 'bold 50px serif';
	labels = [`${scale[0]}m (i)`, `${scale[1]}\xB0 (ii)`, `${scale[2]} (III)`, `${scale[3]}m (iv)`, `${scale[4]}m (v)`, `${scale[5]} (VI)`, `${scale[6]} (VII)`]
	labels.forEach((label, index) => {
		ctx.font = 'bold 50px serif';
			ctx.fillText(label, boards[index].x+protoBoard.width/2, 200)		
	}) 

	ctx.font = 'bold 25px serif';
	ctx.fillStyle = "red";
	ctx.fillText("root position (1,3,5)", canvas.width/10, 50)
	ctx.fillStyle = "purple" ;
	ctx.fillText("1st inversion (3,5,1)", canvas.width/10, 80)
	ctx.fillStyle = "blue";
	ctx.fillText("2nd inversion  (5,1,3)", canvas.width/10, 110)	
}

const boards = []
for(let i = 0; i<7; i++){
	let spacer =  110//(document.getElementById("cancan").clientWidth-(protoBoard.width*boards.length))/9
	boards.push(makeFretboard(spacer+spacer*i+protoBoard.width*i,canvas.height-protoBoard.height-20))	
}

boards.forEach(b =>
  b.draw() 
)


function updateScaleandTriads(){
	refreshScale()
	ctx.clearRect(0,0,canvas.width, canvas.height)
	chordCtx.clearRect(0,0,canvas.width, canvas.height)
	if(majMinChooser.selectedIndex === 0){
		fullTriadSetMajor(keyChooser.options[keyChooser.selectedIndex].text, document.getElementById("stringSetChooser").selectedIndex+1)
	}else{
		fullTriadSetMinor(keyChooser.options[keyChooser.selectedIndex].text, document.getElementById("stringSetChooser").selectedIndex+1)
	}
}

keyChooser.selectedIndex = 0;
updateScaleandTriads()


console.log("..")
