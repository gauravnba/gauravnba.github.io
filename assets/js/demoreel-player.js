var isDesktop = false;
var player;

if(!( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)))
{
	isDesktop = true;
	// 2. This code loads the IFrame Player API code asynchronously.
	var tag = document.createElement('script');

	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
function onYouTubeIframeAPIReady()
{
	player = new YT.Player('player', 
	{
		/*height: '1920',
		width: '1080',*/
		videoId: 'ZQRJzjga4Yw',
		playerVars:{'controls': 0, 'showinfo': 0, 'rel': 0, 'modestbranding': 1, 'fs': 1, 'loop': 1, 'playlist': 'ZQRJzjga4Yw', 'vq': 'hd1080', 'mute': 1},
		events: 
		{
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
	
	// Listen to the scroll event to control background video.
	window.addEventListener('scroll', runOnScroll, false);
	
	var div = document.getElementById("wrapper_first");
	var button = document.createElement("a");
	var buttonText = document.createTextNode("Toggle Audio");
	button.setAttribute('id', "audio_button");
	button.setAttribute('onclick',"toggleAudio();");
	button.setAttribute('style',"position: absolute; margin: 1% 1%;");
	button.setAttribute('class',"button icon solo volume-off");
	button.appendChild(buttonText);
	div.appendChild(button);
	
	// Add mute button to the wrapper if a desktop browser is detected.
	button.addEventListener("click", function (e) {
		var target = e.target;
	
		target.classList.toggle("volume-on");
		target.classList.toggle("volume-off");
	}, false);
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) 
{
	event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event)
{
	if (event.data == YT.PlayerState.ENDED && !done) 
	{
	//setTimeout(stopVideo, 103000);
	document.getElementById('continue_button').click();
	done = true;
	}
}

function toggleAudio()
{
	if(player.isMuted())
	{
		player.unMute();
	}
	else
	{
		player.mute();
	}
}

// Display the video in an iframe if using a mobile screen.
function loadIframeIfMobile()
{
	if(!isDesktop)
	{
		var header = document.getElementsByClassName("major");
		var video = document.createElement("IFRAME");
		video.setAttribute('style', "position: relative; width: 95%");
		video.setAttribute('src', "https://www.youtube.com/embed/ZQRJzjga4Yw?rel=0");
		video.setAttribute('allowfullscreen', "");
		video.setAttribute('allow', "autoplay; encrypted-media");
		header[0].appendChild(video);
	}
}

// Check if video is in view and play or stop it based on that.
function runOnScroll()
{
	var wrapperHeight = document.getElementById("wrapper").offsetHeight;
	var scrollTop = (window.pageYOffset == undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
	if(scrollTop == 0)
	{
		player.playVideo();
	}
	else if(scrollTop >= (window.innerHeight-(wrapperHeight*0.09)))
	{
		player.pauseVideo();
	}
}