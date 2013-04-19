jQuery(document).ready(function(){

	// turn on twitter bootstrap popovers
	// http://twitter.github.io/bootstrap/javascript.html#popovers
	jQuery('img.dwdphoto').popover({
		trigger : "hover",
		delay: { show: 100, hide: 200 }
	});

	jQuery('a.deleteBtn').click(function(e){

		var isConfirmed = confirm("Are you sure you want to delete this photo?");
		if (!isConfirmed){
			e.preventDefault();
			return False;
		} else {
			// Was confirmed to delete.
		}
	})

})