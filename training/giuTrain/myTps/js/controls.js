////////////////// KEYBOARD INPUT CONTROLS ///////////////////

var Key = {
    _pressed: {},
    LEFT: 65,
    UP: 87,
    RIGHT: 68,
    DOWN: 83,
    
    isDown: function(keyCode) {
      return this._pressed[keyCode];
    },
    
    onKeydown: function(event) {
      this._pressed[event.keyCode] = true;
    },
    
    onKeyup: function(event) {
      delete this._pressed[event.keyCode];
    }
  };

    // scene.onKeyboardObservable.add((kbInfo) => {
    //     switch (kbInfo.type) {
    //         case BABYLON.KeyboardEventTypes.KEYDOWN:
    //             console.log("KEY DOWN: ", kbInfo.event.key);
    //             switch (kbInfo.event.keyCode) {
    //                 case 87: // "W"
    //                     //meshPlayer.moveWithCollisions(new BABYLON.Vector3(meshPlayer.position.x+1,meshPlayer.position.y,meshPlayer.position.z+1))
    //                     meshPlayer.position.x -= 1;
    //                     light2.position.x -= 1;
    //                     break;
    //                 case 65: //"A"
    //                     meshPlayer.position.z -= 1;
    //                     light2.position.z -= 1;
    //                     break;
    //                 case 83: //"S"
    //                     meshPlayer.position.x += 1;
    //                     light2.position.x += 1;
    //                     break;
    //                 case 68: //"D"
    //                     meshPlayer.position.z += 1;
    //                     light2.position.z += 1;
    //                     break;
    //             }

    //             break;
    //         case BABYLON.KeyboardEventTypes.KEYUP:
    //             console.log("KEY UP: ", kbInfo.event.keyCode);
    //             break;
    //     }
    // });


  

    