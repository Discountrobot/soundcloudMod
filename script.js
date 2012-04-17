// hide comments
(function() {
	$('li.player .player.mode').toggleClass('no-comments');
})();	

(function() {
	// create localStorage array if undefined
	if(localStorage['scm_tracks'] === undefined) {
		localStorage['scm_tracks']=JSON.stringify([]);
	}
	function moderateHandle(context, reason) {
		// get the localStorage string
		var moderatedTracks = JSON.parse(localStorage['scm_tracks']);

		//track id
		var id = $(context).closest('li.player').find('.player.mode').attr('data-sc-track'),
			// parse the string to an array
			moderatedTracks = JSON.parse(localStorage['scm_tracks']),
			// is the track already in the db ? 
			track = hasBeenModerated(moderatedTracks, id),
			// init date obj
			date = new Date(),
			// create dateString 
			dateString = dateString = date.getDate() + '/' + date.getMonth();
		
		if(! track) {
			//create a new track
			track = { 
				'id': id,
				'a': reason,
				d: dateString
			};
			//push the track to the array.
			moderatedTracks.push(track);
		}
		else {
			//find the index of the existing track
			var i = moderatedTracks.indexOf(track);
			moderatedTracks[i].d = dateString
			moderatedTracks[i].a = reason;
		}

		localStorage['scm_tracks'] = JSON.stringify(moderatedTracks);
	}
	// extend the soundcloud approve button click handle to save the track id.
	$('a.approve.icon-button.contribution').click(function() {
		moderateHandle(this, 1)
	});
	// destroy 
	$('a.destroy.icon-button.contribution.remove').click(function() {
		moderateHandle(this, 0)
	});	

	$('li.player').each(function() {

		//player context
		var $player = $(this),
			// is the track under moderation ?
			$underMod = $player.find('div.moderate-track'),
			//the track
			$track = $player.find('.player.mode');

		// if the track is under moderation proceed
		if( $underMod.length > 0 ) {

			var moderatedTracks = JSON.parse(localStorage['scm_tracks']),
				id = $track.attr('data-sc-track'),
				track = hasBeenModerated( moderatedTracks, id );

			if(track) {
				var $inner = $underMod.find('.moderate-track-inner');
				$inner.css('background' , 'lightCoral');

				//get the track title
				var track_title = $player.find('.info-header h3 a').text(),
					action = track.a ? 'approved' : 'disapproved'

				// forge the message
				var $msg = $('<div></div>').html('<b>' + track_title + '</b> was last seen <b>' + track.d + '</b> and was <b>' + action + '</b>');
				$msg.prependTo($inner);
			}
			else {
				//console.log(track_id+' has not been moderated');
			}

		}
	})

	// checks an array with objects if the 'id' is present
	function hasBeenModerated (arr,val) {
		for(var i in arr) {
			if(arr[i].id == val) {
				return arr[i];
			}
		}
		return undefined;
	}
})();

