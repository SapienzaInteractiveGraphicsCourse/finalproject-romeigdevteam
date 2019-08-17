var Soldier = {
    isMoving: false,
    forwardAnimationTimer: null,

    aiming_pose: function (scene) {
        scene.getBoneByName("Bip01 R UpperArm").setRotation(new BABYLON.Vector3(0, +H.toRad(30), + H.toRad(50)));
        scene.getBoneByName("Bip01 R Forearm").setRotation(new BABYLON.Vector3(H.toRad(30), H.toRad(90), -H.toRad(90)));

        scene.getBoneByName("Bip01 L UpperArm").setRotation(new BABYLON.Vector3(0, +H.toRad(70), - H.toRad(50)));
        scene.getBoneByName("Bip01 L Forearm").setRotation(new BABYLON.Vector3(0, H.toRad(90), H.toRad(90)));

    },
    moveForwardAnimation: function () {
        
        scene.getBoneByName("Bip01 L Calf").setRotation(0,H.toRad(45),0)
        scene.getBoneByName("Bip01 L Thigh").setRotation(0,H.toRad(-45),0)
    }

    ,

    moveLeftAnimation: function () {

        scene.getBoneByName("Bip01 Spine").setRotation(new BABYLON.Vector3(-Math.PI * 1.5, 0, 0));
        scene.getBoneByName("Bip01 Pelvis").setRotation(new BABYLON.Vector3(0.2, -Math.PI * 1.45, Math.PI * 0.45));

    },
    moveBackwardAnimation: function () {

    },
    moveRightAnimation: function () {
        scene.getBoneByName("Bip01 Spine").setRotation(new BABYLON.Vector3(-Math.PI * 0.3, 0, 0));
        scene.getBoneByName("Bip01 Pelvis").setRotation(new BABYLON.Vector3(0.2, -Math.PI * 0.65, Math.PI * 0.55));

    },
    standAnimation: function () {


    }
}


