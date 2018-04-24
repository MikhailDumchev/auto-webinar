
if(screen.width <= 479) {
	$(".pluses-block br, .screen2 .subtitle br, .screen5 .scr5-item br, .screen6 .title br, .screen6 .scr6_right-par br, .screen10 .subtitle br, .screen11 .title br").css("display", "none");
}

if(screen.width <= 880) {
	$(".screen10 .scr10-item br").css("display", "none");
}

$(".nav-mob").click(function() {
	$(".header-right").css("top", "0");
});

$(".header .nav-list__item--link, .header .btn-small").click(function() {
	setTimeout(function() {
		$(".header-right").css("top", "-400px");
	}, 500); 
});


$(document).mouseup(function (e) {
    var container = $(".header-right");
    if (container.has(e.target).length === 0 && 
    	$(".nav-mob").has(e.target).length === 0){
        container.css("top", "-400px");
    }
});


$(document).ready(function(){
    $('.nav-list__item--link, .to-top, button a').click( function(){
        var scroll_el = $(this).attr('href');
        if ($(scroll_el).length != 0) {
            setTimeout(function() {
            	$('html, body').animate({ scrollTop: $(scroll_el).offset().top }, 2000);
            }, 500); 
        }
        return false; 
    });
});