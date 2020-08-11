var isDesktop = false;
var player;
if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
	isDesktop = true;
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
	player = new YT.Player('player',
		{
			height: '1080',
			width: '1920',
			videoId: 'ZQRJzjga4Yw',
			playerVars:
			{
				'controls': 0,
				'showinfo': 0,
				'rel': 0,
				'modestbranding': 1,
				'fs': 1,
				'loop': 1,
				'playlist': 'ZQRJzjga4Yw',
				'mute': 1
			},
			events:
			{
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			}
		});
	window.addEventListener('scroll', runOnScroll, false);
	var div = document.getElementById("wrapper_first");
	var button = document.createElement("a");
	var buttonText = document.createTextNode("Toggle Audio");
	button.setAttribute('id', "audio_button");
	button.setAttribute('onclick', "toggleAudio();");
	button.setAttribute('style', "color: #ffffff; z-index:10; position: absolute; margin: -75vh -49vw;");
	button.setAttribute('class', "button icon solo volume-off");
	button.appendChild(buttonText);
	div.appendChild(button);
	button.addEventListener("click", function (e) {
		var target = e.target;
		target.classList.toggle("volume-on");
		target.classList.toggle("volume-off");
	}, false);
}

function onPlayerReady(event) {
	event.target.playVideo();
}
var done = false;

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.ENDED && !done) {
		document.getElementById('continue_button').click();
		done = true;
	}
}

function toggleAudio() {
	if (player.isMuted()) {
		player.unMute();
		player.setVolume(75)
	}
	else {
		player.mute();
	}
}
document.addEventListener("DOMContentLoaded", loadIframeIfMobile);

function loadIframeIfMobile() {
	if (!isDesktop) {
		var div = document.getElementById("mobile_video");
		var video = document.createElement("iframe");
		video.setAttribute('style', "width: 80vw; height: 45vw");
		video.setAttribute('src', "https://www.youtube.com/embed/ZQRJzjga4Yw?rel=0");
		video.setAttribute('allowfullscreen', "");
		video.setAttribute('allow', "autoplay; encrypted-media");
		video.setAttribute('frameborder', "0");
		div.appendChild(video);
	}
}

function runOnScroll() {
	var wrapperHeight = document.getElementById("wrapper").offsetHeight;
	var scrollTop = (window.pageYOffset == undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
	if (scrollTop == 0) {
		player.playVideo();
	}
	else if (scrollTop >= (window.innerHeight - (wrapperHeight * 0.09))) {
		player.pauseVideo();
	}
}