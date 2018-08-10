var sliderLeft,
	sliderRight,
	volumeBar,
	volumeDisplay;

var leftDirection,
	rightDirection;
	// Also, oneDirection

var barRotation = 0;
var maxBarRotation = 45;
var maxVolumeScale = 100;

var milliseconds = 1000;
var ticksPerSecond = 100;

var tickSize          = 1;
var gravityFuckFactor = 0.5;
var gravityTick       = 10 * tickSize * gravityFuckFactor;

var gravityFlag     = 0;

var DEBUG = false;
var FEATURE_GRAVITY = false;
var FEATURE_DRIFT = true;
var FEATURE_DRIFT_TWIST = false;
var FEATURE_DRIFT_STOP = false;

window.onload = function () {
	volumeBar = document.getElementById('volumeBar');
	sliderLeft = document.getElementById('sliderLeft');
	sliderRight = document.getElementById('sliderRight');
	volumeDisplay = document.getElementById('volumeDisplay');

	prepareFuckery();
}

function setVolume() {
	rotation = ((sliderLeft.value / sliderLeft.max) - (sliderRight.value / sliderRight.max)) * maxBarRotation;
	rotation = clamp(rotation, -maxBarRotation, maxBarRotation);
	volumeBar.style.transform = `rotate(${rotation}deg)`;

	volumeBar.value = (parseInt(volumeBar.value)) + Math.round(rotation);

	volumeDisplay.innerText = Math.round(volumeBar.value / maxVolumeScale);
}

dirs = {
	"-1": "down",
	"0": "nowhere",
	"1": "up"
};
function getDriftDirection() {
	if (!FEATURE_DRIFT_STOP) {
		// [-1, 1]
		return Math.round(Math.random()) ? 1 : -1;
	} else {
		// [-1, 0, 1]
		return Math.round(Math.random() * 2) - 1;
	}
}

function setBehavior() {
	if (FEATURE_DRIFT_TWIST) {
		rightDirection = getDriftDirection();
		leftDirection  = getDriftDirection();

		if (DEBUG) {
		console.log(`setBehavior: Left drifting ${dirs[leftDirection]}, ` +
				`Right drifting ${dirs[rightDirection]}`);
		}
	} else {
		leftDirection = rightDirection = getDriftDirection();

		if (DEBUG) {
			console.log(`setBehavior: Drifting ${dirs[leftDirection]}`);
		}
	}
}

function prepareFuckery() {
	setBehavior();

	setInterval(function () {
		setBehavior();
	}, milliseconds * 10);

	setInterval(function () {
		doFuckery();
		setVolume();
	}, Math.round(milliseconds / ticksPerSecond));
}

function doFuckery() {
	doDrift();
	doGravity();
	setVolume();
}

function clamp(number, from, to) {
	if (number < from) {
		number = from;
	} else if (number > to) {
		number = to;
	}
	return number;
}

function doDrift() {
	if (!FEATURE_DRIFT) return;
	sliderLeft.value  = parseInt(sliderLeft.value)  + tickSize * leftDirection;
	sliderRight.value = parseInt(sliderRight.value) + tickSize * rightDirection;
}

function doGravity() {
	if (!FEATURE_GRAVITY) return;
	if ((++gravityFlag) === gravityFlag) {
		let _min = parseInt(volumeBar.min);
		let _max = parseInt(volumeBar.max);
		let _value = parseInt(volumeBar.value);
		let center = (parseInt(volumeBar.max) + parseInt(volumeBar.min)) / 2;

		let weight = Math.round(gravityTick * ((_value - center)) / (_max - _min));

		sliderLeft.value  = parseInt(sliderLeft.value)  + weight;
		sliderRight.value = parseInt(sliderRight.value) - weight;
	} else {
		gravityFlag = 0;
	}
}

