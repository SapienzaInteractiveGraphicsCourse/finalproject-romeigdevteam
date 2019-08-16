var Soldier = {

aiming_pose: function(scene){
    scene.getBoneByName("Bip01 R UpperArm").setRotation(new BABYLON.Vector3(0,+H.toRad(30),+ H.toRad(50)));
    scene.getBoneByName("Bip01 R Forearm").setRotation(new BABYLON.Vector3(H.toRad(30),H.toRad(90),-H.toRad(90)));

    scene.getBoneByName("Bip01 L UpperArm").setRotation(new BABYLON.Vector3(0,+H.toRad(70),- H.toRad(50)));
    scene.getBoneByName("Bip01 L Forearm").setRotation(new BABYLON.Vector3(0,H.toRad(90),H.toRad(90)));

}

}


