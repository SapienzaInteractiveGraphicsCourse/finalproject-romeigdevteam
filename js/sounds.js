var playMusic = true

// create an AudioListener and add it to the camera
var listener = new THREE.AudioListener();

// create a global audio source
var music = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer


var sounds = {

    1:{
        path: "/sounds/auto.ogg",
        audio: null
    },

    
    2:{
        path: "/sounds/autoHev.ogg",
        audio: null
    },
    
    3:{
        path: "/sounds/sniperRel.mp3",
        audio: null
    },

}

function initSounds(){


    var audioLoader = new THREE.AudioLoader();
    audioLoader.load( 'sounds/HumbleMatch.ogg', function( buffer ) {
        music.setBuffer( buffer );
        music.setLoop( true );
        music.setVolume( 0.5 );
        music.play();
    });

    for (var _key in sounds)        (function (key) {   
        console.log(key)
        sounds[key].audio = new THREE.Audio( listener )
        audioLoader.load(sounds[key].path, function( buffer ) {
            sounds[key].audio.setBuffer( buffer );
            if(key<3)
            sounds[key].audio.setLoop( true );
            else
            sounds[key].audio.setLoop( false);
            sounds[key].audio.setVolume( 0.5 );
            //sounds[key].audio.play();

        });
    
    })(_key)

}


