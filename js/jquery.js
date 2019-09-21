// Semi-constants
var WINWIDTH = window.innerWidth,
    WINHEIGHT = window.innerHeight,
    ASPECT = WINWIDTH / WINHEIGHT

// // Initialize and run on document ready
// $(document).ready(function() {
// 	$('body').append('<div id="intro">Click to start</div>');
// 	$('#intro').css({width: WINWIDTH, height: WINHEIGHT}).one('click', function(e) {
// 		e.preventDefault();
// 		$(this).fadeOut();

// 	});
// });


function htmlCloseLoading(){
    const loadingScreen = document.getElementById( 'loading-screen' );
    loadingScreen.classList.add( 'fade-out' );
    console.log("stop loading animation");
    // optional: remove loader from DOM via event listener
    $('#loading-screen').fadeOut(30);
    $('#loading-screen').html=""
}



var reloadingInterval;

function jQueryInit() {


    // Set up the brief red flash that shows when you get hurt
    $('body').append('<div id="hurt"></div>');
    $('#hurt').css({ width: WINWIDTH, height: WINHEIGHT, });


    // Display the HUD: radar, health, score, and credits/directions
    //$('body').append('<div id="hud"><p>Health: <span id="health">100</span><br />Score: <span id="score">0</span></p></div>');
    //Credits + istr.
    //$('body').append('<div id="credits"><p>Created by <a href="http://www.isaacsukin.com/">Isaac Sukin</a> using <a href="http://mrdoob.github.com/three.js/">Three.js</a><br />WASD to move, mouse to look, click to shoot</p></div>');

    // Health bat
    $('body').append('<div class="total"></div><div class="healthArea"><div class="valueLife"></div><div class="health-box"><div class="health-bar-red"></div><div class="health-bar"></div><div class="health-bar-text"></div></div></div>');

    // Retina aim pointer image
    // $('body').append('<div class="verticalhorizontal"><img src="./sprites/retinas/White/crosshair042.png" alt="centered image" /></div>');
    // $('img').click(false)

    // Current Round text ( appearas at starting of each round )
    
    //Reload text
    $("body").append('<div id="reloadText"> Reload [R] </div>')

    //Ammo Icon
    $("body").append('<div id="ammoDiv"> <img  src="./sprites/hud/ammoIcon.png" > <a></a> </div>')

    
}

/*

    LIFEBAR
*/


var maxHealth = playerLife,
    curHealth = maxHealth;
$('.total').html(maxHealth + "/" + maxHealth);
$(".health-bar-text").html("100%");
$(".health-bar").css({
    "width": "100%"
});
$(".add-damage").click(function () {
    if (curHealth == 0) {
        $('.message-box').html("Is this the end??");
    } else {
        var damage = Math.floor((Math.random() * 100) + 50);
        $(".health-bar-red, .health-bar").stop();
        curHealth = curHealth - damage;
        if (curHealth < 0) {
            curHealth = 0;
            restart();
        } else {
            $('.message-box').html("You took " + damage + " points of damage!");
        }
        applyChange(curHealth);
    }
});
$(".add-heal").click(function () {
    if (curHealth == maxHealth) {
        $('.message-box').html("You are already at full health");
    } else {
        var heal = Math.floor((Math.random() * 100) + 5);
        $(".health-bar-red, .health-bar-blue, .health-bar").stop();
        curHealth = curHealth + heal;
        if (curHealth > maxHealth) {
            curHealth = maxHealth;
            $('.message-box').html("You're at full health");
        } else if (curHealth == 0) {
            $('.message-box').html("Miraculously! You regained your health by " + heal + " points and get back on to your feet!");
        } else {
            $('.message-box').html("You regained your health by " + heal + " points!");
        }
        applyChange(curHealth);
    }
});

function changePlayerLifeBar(curHealth) {
    var a = curHealth * (100 / maxHealth);
    $(".health-bar-text").html(Math.round(a) + "%");
    $(".health-bar-red").animate({
        'width': a + "%"
    }, 700);
    $(".health-bar").animate({
        'width': a + "%"
    }, 500);
    $(".health-bar-blue").animate({
        'width': a + "%"
    }, 300);
    //$('.total').html(curHealth + "/" + maxHealth);
}

function restartPlayerLifeBar() {
    //Was going to have a game over/restart function here.
    $('.health-bar-red, .health-bar');
    $('.message-box').html("You've been knocked down! Thing's are looking bad.");
}


//On game over
function fadeOutAll() {

    $(renderer.domElement).fadeOut();

    //$('.healthArea', ".valueLife", ".health-box", ".health-bar-red", ".health-bar", ".health-bar-text").fadeOut();
    $('.healthArea').fadeOut();
    $('#ammoDiv').fadeOut();

    $('.intro').fadeIn();
    $('#loseText').append(zombieWave - 1)
   
}


function jqAppearCurrentRoundText() {
    

    if (zombieWave < 10) {
        const htmlString = "<img class='column' id='roundValue' src=' ./sprites/round/" + zombieWave + ".png '>"
        $('#valueDiv').html(htmlString)
    }
    else {
        //digitRight: zombieWave % 10
        //digitLeft: Math.floor((1234 / 10) % 10);
        const htmlString = "<img class='column' id='roundValue' src=' ./sprites/round/"
            + (zombieWave % 10) + ".png '>"
            + "<img class='column' id='roundValue' src=' ./sprites/round/"
            + (Math.floor((zombieWave / 10) % 10)) + ".png '>"
        $('#valueDiv').html(htmlString)
    }

    $('#roundTextDiv').fadeOut(3000);
}


function jqNeedReload(){
    if(reloadingInterval)
        return
        $("#reloadText").fadeIn(500)
        $("#reloadText").fadeOut(500)
    reloadingInterval = setInterval( () =>{
        $("#reloadText").fadeIn(500)
        $("#reloadText").fadeOut(500)
    }, 1000);

}

function jqUpdateAmmo(mode=""){
    if(mode=="sliding"){

    }
    $("#ammoDiv a").html(numBullets)


}



function resEn(el){
	$(el)
.fadeOut(300)
.fadeIn(300)
.fadeOut(300)
.fadeIn(300)
.animate({
    top:'25%',
    height: '125%',
    width: '125%'
})

setTimeout(() => {
    $(el).animate({
        top:'0%',
        height: '100%',
        width: '100%'
    })    
}, 2000);
}