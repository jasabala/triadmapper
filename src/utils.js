console.clear();


const canvas = document.getElementById("cancan");
const container = document.getElementById("container");
let canHeight = 1000;
let canWidth = 2000;
canvas.width = canWidth;
canvas.height = canHeight;
const ctx = canvas.getContext("2d");

const backCanvas = document.getElementById("backcan");
const backCtx = backCanvas.getContext("2d");
backCanvas.width = canWidth;
backCanvas.height = canHeight;

const chordCanvas = document.getElementById("chordcan");
chordCanvas.width = canWidth;
chordCanvas.height = canHeight;
const chordCtx = chordCanvas.getContext("2d");


ctx.textBaseline = "middle";
ctx.textAlign = "center";
ctx.fillStyle = "#cac8c5"
ctx.fillRect(0,0,canvas.width,canvas.height)

const keyChooser = document.getElementById("keyChooser");
const majMinChooser = document.getElementById("majMinChooser");
const partsChooser = document.getElementById("partsChooser");
for (let index = 0; index < 12; index++) {
	keyChooser.options[keyChooser.options.length] = new Option(
		chromaticScale[index],
		index
	);
}
function getNewParts() {
	if (majMinChooser.selectedIndex == 0) {
		partsChooser.options[2].text = "major 7th arpeggio";
		partsChooser.options[3].text = "dominant 7th arpeggio";
	} else {
		partsChooser.options[2].text = "minor 7th";
		partsChooser.options[3].text = "diminished 7th";
	}

	refreshScale();
}

keyChooser.selectedIndex = 7;
majMinChooser.selectedIndex = 0;

let protoBoard = {
	width: canvas.width/12,
	height: canvas.height*.7,
	stringSpace: canvas.width/12/stringNotes[document.getElementById("tuning").value].length,
	fretSpace: canvas.height*.7/15,
	colors: {
		fretboard: "beige",
		dots: "lightgrey",
		roots: "darkgrey",
		shadowDots: "green",
		shadowRoots: "blue",
		frets: "brown",
		strings: "darkblue",
		fretNums: "grey",
		notes: "#8e8888"
	}
};

function getScale(root, majOrMin, parts){
	let start = chromaticScale.indexOf(root);
	let newScale = [];
	newScale.push(root);
	for (let i = 0; i < steps[majOrMin][parts].length; i++) {
		newScale.push(chromaticScale[start + steps[majOrMin][parts][i]]);
	}	
	return newScale;
};

function makeFretboard(x,y){
	protoBoard.stringSpace =  canvas.width/12/stringNotes[document.getElementById("tuning").value].length
	let b = {}
	b.x = x
	b.y = y	
	b.draw = ()=>{
		ctx.lineWidth = 0.5;
	ctx.globalAlpha = 1;
	ctx.fillStyle = protoBoard.colors.fretboard;
	ctx.fillRect(
		b.x - protoBoard.stringSpace / 2,
		b.y,
		protoBoard.width,
		protoBoard.height
	);
	ctx.drawImage(backCanvas, 0, 0);
	ctx.strokeStyle = protoBoard.colors.strings;
	for (let i = 0; i <= stringNotes[document.getElementById("tuning").value].length-1; i++) {		
		ctx.beginPath();
		ctx.moveTo(b.x + protoBoard.stringSpace * i, b.y);
		ctx.lineTo(b.x + protoBoard.stringSpace * i, b.y + protoBoard.height);
		ctx.stroke();
	}
	ctx.strokeStyle = protoBoard.colors.frets;
	let boldFrets = [0,3,5,7,10,12]

	for (let i = 0; i <= 15; i++) {
		ctx.beginPath();
		if(boldFrets.indexOf(i) > -1 ){
			ctx.lineWidth = 1.5
		}else{
			ctx.lineWidth = .5
		}
		ctx.moveTo(
			b.x- protoBoard.stringSpace / 2,
			b.y + protoBoard.fretSpace * i
		);
		ctx.lineTo(
			b.x + protoBoard.width - protoBoard.stringSpace / 2,
			b.y + protoBoard.fretSpace * i
		);
		ctx.stroke();
	}
	ctx.fillStyle = protoBoard.colors.fretNums;
	ctx.font = "20pt Verdana";
	["3", "5", "7", "10", "12"].forEach((num) => {
		ctx.fillText(
			num,
			b.x - 1.1 * protoBoard.stringSpace,
			b.y + protoBoard.fretSpace * num
		);
	});
	}
	return b
}

function labelBoard(board, scale){
	stringNotes[document.getElementById("tuning").value].forEach((string, o)=>{
		string.forEach((fret, i)=>{
			if(scale.indexOf(fret) >= 0){
				let str =stringNotes[document.getElementById("tuning").value].length-1-o
				ctx.beginPath();
				ctx.fillStyle = (fret != scale[0]) ? protoBoard.colors.dots: protoBoard.colors.roots;
				ctx.arc(protoBoard.stringSpace*str+board.x,protoBoard.fretSpace*i+board.y-protoBoard.fretSpace*.3,14, 0, 6.5, 0)
				ctx.fill()	
				ctx.beginPath();
				ctx.lineWidth = 1;
				ctx.fillStyle = protoBoard.colors.notes
				ctx.font = "bold 12pt Verdana";
				ctx.fillText(
					fret,				protoBoard.stringSpace*str+board.x,protoBoard.fretSpace*i+board.y-protoBoard.fretSpace*.3
				);
			}
		})
	})	
}

function refreshScale(){
	let scale = getScale(keyChooser.options[keyChooser.selectedIndex].text, majMinChooser.options[majMinChooser.selectedIndex].value, partsChooser.options[partsChooser.selectedIndex].value)
	boards.forEach(board => {
		board.draw()
		labelBoard(board, scale)
	})		
}



//---------------------------------------

function showNote(board, string, fret, color, ctx) {
	if(!ctx){
		ctx = chordCtx
	}
	string = stringNotes[document.getElementById("tuning").value].length-string
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.lineWidth = 3;
	ctx.strokeStyle = color;
	ctx.globalAlpha = 1;
	ctx.arc(protoBoard.stringSpace*string+board.x,protoBoard.fretSpace*fret+board.y-protoBoard.fretSpace*.3,12, 0, 6.5, 0
	);
	ctx.stroke();
}

function sketchTriad(board, root, stringSet, inversion, color){
	stringSet -= 1
	let notes = []
	inversion.forEach((inversion, index)=>{
		let npos = chromaticScale.indexOf(root) + inversion
		let note = chromaticScale[npos]		
		let string = stringSets[document.getElementById("tuning").value][stringSet][index]
		let stringPos = stringNotes[document.getElementById("tuning").value][string].indexOf(note)		
		notes.push(stringPos)
	})
	let smallNotes = notes.filter(e => e<4)
	let largeNotes = notes.filter(e => e>6)
	
	//fix 2 low 1 high
	inversion.forEach((inver, index)=>{
		if(smallNotes.length === 2 && largeNotes.length ===1){
			smallNotes.forEach((note, ii)=>{
				if(note < 5){
					smallNotes[ii] += 12
					notes[ii] += 12
				}
			})
		}
	})

	//fix 1 low 2 high
	inversion.forEach((inver, index)=>{
		if(smallNotes.length === 1 && largeNotes.length ===2){
			console.log("fuck these ones:",notes)
			smallNotes.forEach((note, ii)=>{
				if(note < 5){
					smallNotes[smallNotes.indexOf(note)] += 12
					notes[notes.indexOf(note)] += 12
				}
			})
		}
	})
	
	smallNotes = notes.filter(n => n < 4)
	inversion.forEach((inversion, index)=>{
		let npos = chromaticScale.indexOf(root) + inversion
		let note = chromaticScale[npos]
		let string = stringSets[document.getElementById("tuning").value][stringSet][index]
		let stringPos = stringNotes[document.getElementById("tuning").value][string].indexOf(note)
		if(smallNotes.length === 3){
			showNote(board, string+1, notes[index]+12, color)	
			console.log("dupe", note)
		}		
		showNote(board, string+1, notes[index], color)
	})
}

function sketchMajorTriad(board, stringSet, root, inversion, color) {	
	let inversions = [
		[0, 4, 7],
		[7, 0, 4],
		[4, 7, 0]
	];
	sketchTriad(board, root, stringSet, inversions[inversion], color)
}
function sketchMinorTriad(board, stringSet, root, inversion, color) {	
	let inversions = [
		[0, 3, 7],
		[7, 0, 3],
		[3, 7, 0]
	];
	sketchTriad(board, root, stringSet, inversions[inversion], color)
}
function sketchDimChord(board, stringSet, root, inversion, color) {	
	let inversions = [
		[0, 3, 6],
		[6, 0, 3],
		[3, 6, 0]
	];
	sketchTriad(board, root, stringSet, inversions[inversion], color)
}
