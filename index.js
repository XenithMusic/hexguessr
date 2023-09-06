const canvas = document.getElementById("color")
const ctx = canvas.getContext("2d")
const input = document.getElementById("input")
const scorecounter = document.getElementById("score")
const submitbtn = document.getElementById("submitbtn")
const scorecard = document.getElementById("scorecard")
const scorecardstart = document.getElementById("scorecardstart")

function getRandomInt(min,max) {
	return Math.round(Math.random()*(max-min)+min)
}

function inputkey(event) {
	if (event.key == "Enter" || event.key == 13) {
		if (submitbtn.disabled == false) { submit() }
	}
}

function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r, g, b) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}
submitbtn.disabled = false
generate()
let score = 0
updateScore()

function submit() {
	console.log("submission")
	submission = hexToRgb(input.value)
	actual = hexToRgb(color)
	if (submission == null) {
		console.log("INVALID SUBMISSION")
		return "invalid submission"
	}
	if (actual == null) {
		console.log("INVALID COLOR, ASSUMING BLACK")
		actual = {r:0,g:0,b:0}
	}
	distance = Math.sqrt(((submission.r-actual.r)**2)+((submission.g-actual.g)**2)+((submission.b-actual.b)**2))
	console.log(distance)
	ctx.beginPath()
	ctx.fillStyle = rgbToHex(submission.r,submission.g,submission.b)
	ctx.fillRect(316,0,316,200)
	ctx.closePath()
	scoretext = updateScore(1000/((distance+1)/10))
	submitbtn.disabled = true
	let x = canvas.cloneNode()
	x.width = "316"
	let xc = x.getContext("2d")
	xc.fillStyle = color
	xc.fillRect(0,0,158,150)
	xc.fillStyle = rgbToHex(submission.r,submission.g,submission.b)
	xc.fillRect(158,0,158,150)
	let y = document.createElement("div")
	y.style.border.top = "1px solid grey"
	y.style.width = "318px"
	let z = document.createElement("p")
	z.classList.add("bold")
	z.innerHTML = scoretext
	y.append(z)
	y.append(document.createElement("br"))
	y.append(color + " vs your guess (" + rgbToHex(submission.r,submission.g,submission.b) + ")")
	y.append(document.createElement("br"))
	y.append(x)
	scorecardstart.after(y)
	setTimeout(generate,2500)
}
function generate() {
	submitbtn.disabled = false
	ctx.clearRect(0,0,canvas.width,canvas.height)
	color = rgbToHex(getRandomInt(0,255),getRandomInt(0,255),getRandomInt(0,255))
	ctx.beginPath()
	ctx.fillStyle = color
	ctx.fillRect(0,0,316,200)
	ctx.closePath()
	console.log(color)
}
function updateScore(change) {
	let c = Math.round(change)
	if (change != null) { score += c }
	let s = Math.round(score)
	scorecounter.innerHTML = (s).toString()
	if (change != null) {
		scorecounter.innerHTML += " (+"+c+")"
		setTimeout(function() {
			if (scorecounter.innerHTML == (s).toString() + " (+"+c+")") {
				scorecounter.innerHTML = (s).toString()
			}
		},2500)
	}
	return scorecounter.innerHTML
}
