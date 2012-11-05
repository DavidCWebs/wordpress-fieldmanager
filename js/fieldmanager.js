( function( $ ) {

var init_sortable = function() {
	$( '.fmjs-sortable' ).each( function() {
		if ( !$( this ).hasClass( 'ui-sortable' ) && $( this ).is( ':visible' ) ) {
			$( this ).sortable( {
				handle: '.fmjs-drag',
				items: '> .fm-item',
				stop: function( e, ui ) {
					var $parent = ui.item.parents( '.fm-wrapper' ).first();
					fm_renumber( $parent );
				}
			} );
		}
	} );
}

var fm_renumber = function( $wrappers ) {
	$wrappers.each( function() {
		var level = $( this ).attr( 'data-fm-level' );
		var level_pos = ( level * 2 ) + 1;
		var order = 0;
		$( this ).find( '> .fm-item:visible' ).each( function() {
			$( this ).find( '.fm-element:visible' ).each( function() {
				var fname = $(this).attr( 'name' );
				fname = fname.replace( /\]/g, '' );
				parts = fname.split( '[' );
				if ( parts[ level_pos ] != order ) {
					parts[ level_pos ] = order;
					var new_fname = parts[ 0 ] + '[' + parts.slice( 1 ).join( '][' ) + ']';
					$( this ).attr( 'name', new_fname );
				}
			} );
			order++;
		} );
	} );
}

$( document ).ready( function () {
	$( '.fm-add-another' ).live( 'click', function( e ) {
		e.preventDefault();
		var el_name = $( this ).attr( 'data-related-element' );
		$new_element = $( '.fmjs-proto.fm-' + el_name ).first().clone();
		$new_element.removeClass( 'fmjs-proto' );
		$new_element = $new_element.insertBefore( $( this ).parent() );
		fm_renumber( $( this ).parents( '.fm-wrapper' ) );
		init_sortable();
	} );
	$( '.fmjs-remove' ).live( 'click', function( e ) {
		e.preventDefault();
		$wrapper = $( this ).parents( '.fm-wrapper' ).first();
		$( this ).parents( '.fm-item' ).first().remove();
		fm_renumber( $wrapper );
	} );
	$( '.fm-collapsible .fm-group-label-wrapper' ).live( 'click', function() {
		$( this ).parents( '.fm-group' ).first().find( '.fm-group-inner' ).toggle();
	} );
	$( '.fm-tab-bar a' ).live( 'click', function( e ) {
		var t = $( this ).attr( 'href' );
		$( this ).parents('.fm-tab').addClass( 'wp-tab-active' ).siblings( 'li' ).removeClass( 'wp-tab-active' );
		$( t ).siblings( 'div' ).hide();
		$( t ).show();
		return false;
	} );
	$('.fm-has-submenu').hoverIntent({
		over: function(e){

			var b, h, o, f, m = $(this).find('.fm-submenu'), menutop, wintop, maxtop;

			if ( m.is(':visible') )
				return;

			menutop = $(this).offset().top;
			menuleft = $(this).position().left;
			menuwidth = $(this).width();
			wintop = $(window).scrollTop();
			maxtop = menutop - wintop - 30; // max = make the top of the sub almost touch admin bar

			b = menutop + m.height() + 1; // Bottom offset of the menu
			h = $('#wpwrap').height(); // Height of the entire page
			o = 60 + b - h;
			f = $(window).height() + wintop - 15; // The fold

			if ( f < (b - o) )
				o = b - f;

			if ( o > maxtop )
				o = maxtop;

			if ( o > 1 )
				m.css('margin-top', '-'+o+'px');
			else
				m.css('margin-top', '');
				
			$(this).find('.fm-submenu').css('left', menuleft);

			$(this).find('.fm-submenu').removeClass('sub-open');
			m.addClass('sub-open');
		},
		out: function(){
			$(this).find('.fm-submenu').removeClass('sub-open').css('margin-top', '');
		},
		timeout: 200,
		sensitivity: 7,
		interval: 90
	});
	init_sortable();
} );

} )( jQuery );