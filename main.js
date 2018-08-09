var sliderLeft,
	sliderRight,
	volumeBar,
	volumeDisplay,
	rand;
var barRotation = 0;

window.onload = function () {
	volumeBar = document.getElementById('volumeBar');
	sliderLeft = document.getElementById('sliderLeft');
	sliderRight = document.getElementById('sliderRight');
	volumeDisplay = document.getElementById('volumeDisplay');

	prepareFuckery();
}

function prepareFuckery() {
	function setVolume(angle) {
		volumeBar.value = (volumeBar.value) - Math.round(angle) * -1;
		volumeDisplay.innerText = Math.round(volumeBar.value / 100);
	}

	setInterval(function () {
		rand = Math.round(Math.random());
		startFuckery();
	}, 10000);

	setInterval(function () {
		barRotation = ((sliderLeft.value / sliderLeft.max) - (sliderRight.value / sliderRight.max)) * 45;
		volumeBar.style.transform = 'rotate(' + barRotation + 'deg)';
		setVolume(barRotation);
	}, 10)
}

function startFuckery() {
	if (rand === 0) {
		setInterval(function () {
			sliderLeft.value = sliderLeft.value - 1;
			sliderRight.value = sliderRight.value - 1;
		}, 10)
	} else if (rand === 1) {
		setInterval(function () {
			sliderLeft.value = sliderLeft.value - -1;
			sliderRight.value = sliderRight.value - -1;
		}, 10)
	}
}
