/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Project  : Aim Player
 * Developer: Aim Mikel (Michael Aloo)
 * Created  : 10 Feb, 2021
 * Copyright: 2021 Aim Mikel
 * Contacts : { email: 'michaelaloo.sudo@gmail.com', phone: '+254703929108' }
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * This project and all its content was created by Aim Mikel and is therefore
 * a copyright of the owner. All rights are therefore reserved.
 *
 * You can edit or redistribute this file as you want.
 * However, this product should not be used for any commercial purposes without
 * owners awareness.
 *
 * The aim of this project was to teach developers who are begginers in web
 * development some basic Javascript fundamentals.
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */

(() => {
	/**
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * This will store all the valid files selected to play.
	 * Each array element is an object containing the file info.
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	let playlist = [];

	/**
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * initialize the default settings of the player.
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	let defaults = {
		repeat: 2,
		position: -1,
		volume: 50,
		current: null, // audio, video
		showRemaining: false,
		mute: false,
	};

	/**
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * Initialize and asign all the dom elements.
	 * This will be used to interact with the player.
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	let btnPlay = fn.dom('#btn-play'),
		btnBackward = fn.dom('#btn-backward'),
		btnForward = fn.dom('#btn-forward'),
		btnPrevious = fn.dom('#btn-previous'),
		btnRepeat = fn.dom('#btn-repeat'),
		btnNext = fn.dom('#btn-next'),
		btnMaximize = fn.dom('#btn-maximize'),
		btnPlaylist = fn.dom('#btn-playlist'),
		btnOpen = fn.dom('#btn-open'),
		btnVolume = fn.dom('#btn-volume'),
		defaultBar = fn.dom('.default-bar'),
		progressBar = fn.dom('.progress-bar'),
		elapsedTime = fn.dom('.elapsed-time'),
		totalTime = fn.dom('.total-time'),
		volumeRange = fn.dom('#volume'),
		volumeVal = fn.dom('.volume-val'),
		playlistCount = fn.dom('.list-count'),
		playlistDisp = fn.dom('.playlist'),
		hoverTime = fn.dom('.hover-time'),
		title = fn.dom('.title'),
		files = fn.dom('#files'),
		video = fn.dom('#video'),
		audio = document.createElement('audio'),
		watermark = fn.dom('#watermark'); //fn.dom('#audio');

	fn.html(btnPlay, svg.pause);
	fn.html(btnBackward, svg.backward);
	fn.html(btnForward, svg.forward);
	fn.html(btnPrevious, svg.previous);
	fn.html(btnRepeat, svg.repeat);
	fn.html(btnNext, svg.next);
	fn.html(btnMaximize, svg.maximize);
	fn.html(btnPlaylist, svg.playlist);
	fn.html(btnVolume, svg.volume);

	/**
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * play or paused the player based on the current state.
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	function playOrPause() {
		if (!fn.isNull(defaults.current)) {
			let elem = defaults.current;
			if (!elem.paused && !elem.ended) {
				elem.pause();
				fn.html(btnPlay, svg.pause);
			} else {
				elem.play();
				fn.html(btnPlay, svg.play);
			}
		}
	}

	/**
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * selects the next media file in the playlist.
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	function next() {
		if (fn.isNull(defaults.current)) return;
		if (defaults.position + 1 < playlist.length) {
			playFile(defaults.position + 1);
		} else {
			playFile(0);
		}
	}

	/**
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * Selects the previous media file in the playlist.
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	function previous() {
		if (fn.isNull(defaults.current)) return;
		if (defaults.position > 0) {
			playFile(defaults.position - 1);
		} else {
			playFile(playlist.length - 1);
		}
	}

	/**
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * Fast backward the player 10 seconds backward.
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	function backward() {
		if (fn.isNull(defaults.current)) return;
		let elem = defaults.current;
		if (elem.currentTime > 10) {
			elem.currentTime -= 10;
		} else {
			elem.currentTime = 0;
		}
	}

	/**
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * Fast forward the player 10 seconds forward.
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	function forward() {
		if (fn.isNull(defaults.current)) return;
		let elem = defaults.current;
		if (elem.duration - elem.currentTime > 10) {
			elem.currentTime += 10;
		} else {
			if (defaults.repeat == 1) {
				playFile(defaults.position);
			} else if (defaults.repeat == 2) {
				next();
			}
		}
	}

	/**
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * Alternates the repeat module of the player.
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	function repeat() {
		if (defaults.repeat == 0) {
			defaults.repeat = 1;
			fn.html(btnRepeat, 1);
			fn.addClass(btnRepeat, 'active');
		} else if (defaults.repeat == 1) {
			defaults.repeat = 2;
			fn.html(btnRepeat, svg.repeat);
			fn.addClass(btnRepeat, 'active');
		} else {
			defaults.repeat = 0;
			fn.html(btnRepeat, svg.repeat);
			fn.removeClass(btnRepeat, 'active');
		}
	}

	/**
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * Maximized the player to full screen if video is playing.
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	function maximize() {
		if (!fn.isNull(defaults.current) && defaults.current === video) {
			if (defaults.current.requestFullScreen) {
				defaults.current.requestFullScreen();
			} else if (defaults.current.webkitRequestFullScreen) {
				defaults.current.webkitRequestFullScreen();
			} else if (defaults.current.mozRequestFullScreen) {
				defaults.current.mozRequestFullScreen();
			}
		}
	}

	/**
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * Toggles the visibility of the playlist.
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	function togglePlaylist() {
		fn.toggleClass(playlistDisp, 'hide');
	}

	/**
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * Renders the playlist and marks the current playing as active.
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	function updatePlaylist() {
		fn.html(playlistCount, `${defaults.position + 1}/${playlist.length}`);
		let tmp = '';
		playlist.forEach((file, pos) => {
			tmp += `<p class="each-item ${defaults.position == pos ? 'current' : ''}">${pos + 1}. ${file.name}</p>`;
		});
		fn.html(playlistDisp, tmp);
	}

	/**
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * Takes the position of the file in the playlist and renders it.
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	function playFile(pos) {
		let file = playlist[pos];
		let url = fn.readFile(file);
		if (!fn.isNull(defaults.current)) {
			playlist[defaults.position].lastTime = defaults.current.currentTime;
			defaults.current.pause();
		}
		defaults.position = pos;
		defaults.current = file.category === 'video' ? video : audio;
		defaults.current === video ? fn.removeClass(video, 'hide') : fn.addClass(video, 'hide');
		defaults.current === video ? fn.addClass(watermark, 'hide') : fn.removeClass(watermark, 'hide');
		defaults.current.src = url;
		defaults.current.currentTime = file.lastTime;
		defaults.current.play();
		defaults.current.volume = defaults.volume / 100;
		fn.text(title, file.name);
		fn.html(btnPlay, svg.play);
		updatePlaylist();
	}

	/**
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * Keeps the player updated by syncing with the real time and user interactions.
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	function updatePlayer() {
		updateProgress();
		let elem = defaults.current;
		if (defaults.showRemaining) {
			fn.html(totalTime, fn.toTime(elem.duration - elem.currentTime));
		} else {
			fn.html(totalTime, fn.toTime(elem.duration));
		}
		fn.html(elapsedTime, fn.toTime(elem.currentTime));
		if (elem.ended) {
			elem.currentTime = 0;
			if (defaults.repeat == 1) {
				playFile(defaults.position);
			} else if (defaults.repeat == 2) {
				next();
			}
		}
	}

	/**
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * Updates the progress bar based on the players real time.
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	function updateProgress() {
		let elem = defaults.current;
		let width = defaultBar.clientWidth;
		let duration = elem.duration;
		let current = elem.currentTime;
		let w = (current / duration) * width;
		fn.css(progressBar, { width: `${w}px` });
	}

	/**
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * Updates the volume of the player based on user interactions.
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	function updateVolume(volume) {
		defaults.volume = volume <= 100 ? volume : 100;
		defaults.volume = volume >= 0 ? volume : 0;
		fn.text(volumeVal, `${defaults.volume}%`);
		fn.val(volumeRange, defaults.volume);
		fn.html(btnVolume, defaults.mute ? svg.volume_slash : svg.volume);
		if (!fn.isNull(defaults.current)) {
			defaults.current.volume = defaults.mute ? 0 : defaults.volume / 100;
		}
	}

	/**
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 * Toggles between mute and unmute volume of the player.
	 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	 */
	function toggleVolume() {
		defaults.mute = !defaults.mute;
		updateVolume(defaults.volume);
	}

	fn.on('click', btnOpen, function (e) {
		files.click();
	});

	fn.on('input', files, function (e) {
		let files = this.files,
			added = false;
		if (!fn.isEmpty(files)) {
			let pos = playlist.length;
			for (let prop in files) {
				let file = files[prop],
					type = null;
				if (file.type === 'video/mp4') {
					type = 'video';
				} else if (file.type == 'audio/mp3' || file.type === 'audio/mpeg') {
					type = 'audio';
				}
				if (type) {
					file.category = type;
					file.lastTime = 0;
					playlist.push(file);
					added = true;
				}
			}
			if (added) {
				playFile(pos);
			}
		}
		btnOpen.blur();
	});

	fn.on('click', btnBackward, backward);
	fn.on('click', btnForward, forward);
	fn.on('click', btnPlay, playOrPause);
	fn.on('click', btnNext, next);
	fn.on('click', btnPrevious, previous);
	fn.on('click', btnRepeat, repeat);
	fn.on('click', btnMaximize, maximize);
	fn.on('click', btnPlaylist, togglePlaylist);
	fn.on('click', btnVolume, toggleVolume);

	fn.on('click', totalTime, function (e) {
		defaults.showRemaining = !defaults.showRemaining;
	});

	fn.on('keyup', document, function (e) {
		e.preventDefault();
		switch (e.keyCode) {
			case 32:
				playOrPause();
				break;
			case 37:
				backward();
				break;
			case 38:
				updateVolume(defaults.volume < 95 ? defaults.volume + 5 : 100);
				break;
			case 39:
				forward();
				break;
			case 40:
				updateVolume(defaults.volume > 5 ? defaults.volume - 5 : 0);
				break;
			case 77:
				toggleVolume();
				break;
			case 78:
				next();
				break;
			case 80:
				previous();
				break;
			default:
				break;
		}
	});

	fn.on('click', defaultBar, function (e) {
		if (fn.isNull(defaults.current)) return;
		let elem = defaults.current;
		let width = defaultBar.clientWidth;
		let duration = elem.duration;
		elem.currentTime = (e.offsetX / width) * duration;
	});

	fn.on('mousemove', defaultBar, function (e) {
		if (fn.isNull(defaults.current)) return;
		let elem = defaults.current;
		let pos = e.offsetX;
		let w = defaultBar.clientWidth;
		let time = (pos / w) * elem.duration;
		fn.text(hoverTime, fn.toTime(time));
		fn.css(hoverTime, { left: `${pos - 40}px` });
		fn.removeClass(hoverTime, 'hide');
	});

	fn.on('mouseout', defaultBar, function (e) {
		fn.addClass(hoverTime, 'hide');
	});

	fn.on('input', volumeRange, function (e) {
		updateVolume(this.value);
	});

	fn.on('click', document, function (e) {
		if (fn.isDef(e.target.className) && fn.includes(e.target.className, 'each-item')) {
			let pos = Array.prototype.indexOf.call(playlistDisp.children, e.target);
			if (pos >= 0 && pos < playlist.length) {
				playFile(pos);
			}
		}
	});

	let timer = setInterval(() => {
		if (!fn.isNull(defaults.current)) updatePlayer();
	}, 100);
})();

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * End of File. Goodbye and good luck in your programming.
 * Remember, genius is 1% talent and 99% hardwork.
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
