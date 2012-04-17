(function() {
	$('li.player .player.mode').toggleClass('no-comments');
})();	

(function test () {
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
			track = hasBeenModerated(moderatedTracks, id);
		
		if(! track) {
			//create a new track
			track = { 
				'id': id,
				'action': reason,
				date: new Date().toDateString() 
			};
			//push the track to the array.
			moderatedTracks.push(track);
		}
		else {
			//find the index of the existing track
			var i = moderatedTracks.indexOf(track);
			moderatedTracks[i].date = new Date().toDateString();
			moderatedTracks[i].action = reason;
		}

		localStorage['scm_tracks'] = JSON.stringify(moderatedTracks);
	}
	// extend the soundcloud approve button click handle to save the track id.
	$('a.approve.icon-button.contribution').click(function() {
		moderateHandle(this, 'approved')
	});
	// distroy 
	$('a.destroy.icon-button.contribution.remove').click(function() {
		moderateHandle(this, 'disapproved')
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
				var track_title = $player.find('.info-header h3 a').text();

				// forge the message
				var $msg = $('<div></div>').html('<b>' + track_title + '</b> was last seen <b>' + track.date + '</b> and was <b>' + track.action + '</b>');
				$msg.prependTo($inner);
			}
			else {
				//console.log(track_id+' has not been moderated');
			}

		}
	})

	function hasBeenModerated (arr,val) {
		for(var i in arr) {
			if(arr[i].id == val) {
				return arr[i];
			}
		}
		return undefined;
	}
})();

