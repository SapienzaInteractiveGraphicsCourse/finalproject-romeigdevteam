"use strict";

var THEGAME = THEGAME || {};
var _gameEngine;


function degreeToRadians(deg) {
    return deg * (Math.PI / 180);
}

THEGAME.Engine = function (babylonEngine) {

    this._babylonEngine = babylonEngine;
    this._scene = null;
    this._meshRegularGuy = null;
    this._camera = null;
    this._currentDebugBoxToDisplay = 0;
    this._debugBoneBoxes = [];
    this._ragDollReady = false;

    var that = this;

    THEGAME.Engine.prototype.updateRagDoll = function () {
        for (var x = 0; x < that._skeletonRegularGuy.bones.length; x++) {

            // for each "test" bone (we'll try just a couple bones)
            var bone = (that._skeletonRegularGuy.bones[x]);
            if (bone.name != "rHand" && bone.name != "rForeArm" && bone.name != "lHand" && bone.name != "lForeArm") {
                continue;
            }
       
            // get the bone's absolute matrix
            var boneMatrix = bone.getAbsoluteMatrix().clone();

            // now find the mesh with the physics enabled...
            var boneDebugBox = "debugBox_" + bone.name;
            var boneMesh = that._scene.getMeshByName(boneDebugBox);
            var boneMeshParent = null;
            if (bone._parent) {
                var boneParentDebugBox = "debugBox_" + bone._parent.name;
                boneMeshParent = that._scene.getMeshByName(boneParentDebugBox);
            }

            // now I want to orient the bone to the LOCATION of the mesh
            // I do this by taking the difference in start and current mesh position
            // and apply the Translation to the matrix (this works)
            var startPosition = boneMesh.saveStartPosition;
            var vectorDiff = boneMesh.position.subtract(boneMesh.saveStartPosition);
            if (boneMeshParent) {
                var vectorDiffParent = boneMeshParent.position.subtract(boneMeshParent.saveStartPosition);
                vectorDiff = vectorDiff.subtract(vectorDiffParent);
            }
            var translationMatrix = BABYLON.Matrix.Translation(vectorDiff.x, vectorDiff.y, vectorDiff.z);
            translationMatrix.invert();
            boneMatrix = boneMatrix.multiply(translationMatrix)


            // ********************
            //     
            // THIS IS WHERE I NEED HELP!
            // Apply the difference in Rotation between the Start Mesh Rotation
            // and the current Rotation to the bone
            //
            // ********************
            // rotation TEST ONLY
            if (boneMeshParent) {

                var matrixRotationStart = new BABYLON.Matrix();
                boneMesh.saveStartRotationQuaternion.toRotationMatrix(matrixRotationStart);

                var matrixRotationCurrent = new BABYLON.Matrix();
                boneMesh.rotationQuaternion.toRotationMatrix(matrixRotationCurrent);

                // I must have this matrix multiply out of order? I dunno
                //matrixRotationStart.invert();
                //var matrixRotation = matrixRotationStart.multiply(matrixRotationCurrent);
                //boneMatrix = boneMatrix.multiply(matrixRotation);

            }

            // finally, take care of parent hierarchy
            if (bone._parent) {
                var parentMatrix = bone._parent.getAbsoluteMatrix().clone();
                parentMatrix.invert();
                boneMatrix = boneMatrix.multiply(parentMatrix);
            }

            // update the animation matrix
            bone.updateMatrix(boneMatrix);
            that._scene.beginAnimation(bone._skeleton, 0, 1, true, 1);
        }
    }

    THEGAME.Engine.prototype.createScene = function () {

        // create the Scene
        var scene = new BABYLON.Scene(this._babylonEngine);
        this._scene = scene;

        // add a light
        var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
        light.position = new BABYLON.Vector3(0, 150, 20);

        // Add a camera that allows rotating view around a point
        var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, new BABYLON.Vector3.Zero(), scene);

        this._camera = camera;
        scene.activeCamera.attachControl(canvas);

        // physics
        scene.enablePhysics();
        scene.setGravity(new BABYLON.Vector3(0, -10, 0));

        // create the ground
        var ground = BABYLON.Mesh.CreateBox("Box", 60.0, scene);
        ground.scaling = new BABYLON.Vector3(5, 1, 5);
        ground.position.y = -35.1;
        //ground.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.5, restitution: 0.7 });

        // create a "hanger" for rag doll
        var hangerbox = BABYLON.Mesh.CreateBox("hangerbox", 0.1, scene);
        hangerbox.position.y = -1;
        hangerbox.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: 0, friction: 0.5, restitution: 0.7 });

        // load the "regular guy" model
        BABYLON.SceneLoader.ImportMesh(scene, function (newMeshes, particleSystems, skeletons) {
            // optional - position and size the mesh
            var mesh = newMeshes[0];
            mesh.position.y = -9.35;
            mesh.position.x = -2;
            mesh.position.z = 0;

            camera.target = new BABYLON.Vector3(-2, -4, 0);
            camera.setPosition(new BABYLON.Vector3(0, -2, 10));
            that._meshRegularGuy = mesh;

            that._skeletonRegularGuy = skeletons[0];

        });


        // code to execute on each render cycle
        this._scene.registerBeforeRender(function () {
            if (that._meshRegularGuy != null) {
                that._currentDebugBoxToDisplay = 0;
            }
        });

        // Once the scene is loaded, just register a render loop to render it
        this._babylonEngine.runRenderLoop(function () {
            if (that._ragDollReady)
            {
                that.updateRagDoll();
            }

            scene.render();
        });

        // Resize
        window.addEventListener("resize", function () {
            that._babylonEngine.resize();
        });

        return scene;

    }

    THEGAME.Engine.prototype.getDistanceBetweenPoints = function (vec1, vec2) {
        var xd = Math.abs(vec2.x - vec1.x);
        var yd = Math.abs(vec2.y - vec1.y);
        var zd = Math.abs(vec2.z - vec1.z);
        var distance = Math.sqrt(xd * xd + yd * yd + zd * zd)
        return distance;
    }

    THEGAME.Engine.prototype.createSkeletonCopy = function () {

        for (var x = 0; x < that._skeletonRegularGuy.bones.length; x++) {
            var bone = (that._skeletonRegularGuy.bones[x]);

            if (that._debugBoneBoxes.length < that._currentDebugBoxToDisplay + 1) {
                var newBox = BABYLON.Mesh.CreateBox("regularGuyBox", 1, that._scene);
                that._debugBoneBoxes.push(newBox);
            }

            var absPos = new BABYLON.Vector3(bone._worldTransform.m[12], bone._worldTransform.m[13] - 9, bone._worldTransform.m[14]);

            that._debugBoneBoxes[that._currentDebugBoxToDisplay].position = absPos;
            that._debugBoneBoxes[that._currentDebugBoxToDisplay].name = "debugBox_" + bone.name;

            // bone's scale == distance between a bone and his parent.  
            var scaleX = 0.1;
            var scaleY = 0.1;
            var scaleZ = 0.1;

            if (bone._parent != null) {
                var absPosParent = new BABYLON.Vector3(bone._parent._worldTransform.m[12], bone._parent._worldTransform.m[13] - 9, bone._parent._worldTransform.m[14]);
                scaleZ = that.getDistanceBetweenPoints(absPos, absPosParent);
            }

            that._debugBoneBoxes[that._currentDebugBoxToDisplay].scaling = new BABYLON.Vector3(scaleX, scaleY, scaleZ);
            that._currentDebugBoxToDisplay++;
        }


        // for a bone's rotation, get direction with bone - LookAt - parent.
        // we will do this as a secondary loop to ensure all parent bones exist.
        for (var x = 0; x < that._skeletonRegularGuy.bones.length; x++) {
            var bone = (that._skeletonRegularGuy.bones[x]);

            // find the parent debug box
            var boneDebugBox = "debugBox_" + bone.name;
            var boneMesh = that._scene.getMeshByName(boneDebugBox);

            if (bone._parent != null) {
                var boneParentDebugBox = "debugBox_" + bone._parent.name;
                var boneParentMesh = that._scene.getMeshByName(boneParentDebugBox);
                boneMesh.lookAt(boneParentMesh.position, 0, degreeToRadians(180), 0);
            }

            // save this "starting matrix" to the bone
            boneMesh.saveStartPosition = boneMesh.position.clone();

            var massValue = 0.1;
            if (bone.name != "rHand" && bone.name != "rForeArm" && bone.name != "lHand" && bone.name != "lForeArm") {
                massValue = 0;
            }

            // add the physics
            boneMesh.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, mass: massValue, friction: 0.5, restitution: 0.001 });
            boneMesh.savePhysicsBody = that._scene._physicsEngine._registeredMeshes[that._scene._physicsEngine._registeredMeshes.length - 1].body;
            if (boneMesh.rotationQuaternion) {
                boneMesh.saveStartRotationQuaternion = boneMesh.rotationQuaternion.clone();
            }

            if (bone._parent != null) {
                that.createJoint(boneMesh, boneParentMesh, new BABYLON.Vector3(0, 0, boneMesh.scaling.z / 2), new BABYLON.Vector3(0, 0, -(boneParentMesh.scaling.z / 2)));
            }


            // "hang"the head from the hanger box
            if (bone.name == "figureHair") {
                boneMesh.setPhysicsLinkWith(that._scene.getMeshByName("hangerbox"), new BABYLON.Vector3(0, 0, boneMesh.scaling.z / 2), new BABYLON.Vector3(0, 0, 0));
            }
        }

        that._ragDollReady = true;
    }

    THEGAME.Engine.prototype.createJoint = function (mesh1, mesh2, pivot1, pivot2) {
        var body1, body2;
        for (var index = 0; index < that._scene._physicsEngine._registeredMeshes.length; index++) {
            var registeredMesh = that._scene._physicsEngine._registeredMeshes[index];

            if (registeredMesh.mesh === mesh1) {
                body1 = registeredMesh.body;
            } else if (registeredMesh.mesh === mesh2) {
                body2 = registeredMesh.body;
            }
        }

        if (!body1 || !body2) {
            return;
        }

        var constraint = new CANNON.PointToPointConstraint(body1, new CANNON.Vec3(pivot1.x, pivot1.z, pivot1.y), body2, new CANNON.Vec3(pivot2.x, pivot2.z, pivot2.y));
        that._scene._physicsEngine._world.addConstraint(constraint);
    };

}

    var canvas = document.getElementById("canvas");

    // Check that browser supports WebGL
    if (!BABYLON.Engine.isSupported()) {
        document.getElementById("notSupported").className = "";
        document.getElementById("opacityMask").className = "";
    } else {

        // create Babylon Engine
        var engine = new BABYLON.Engine(canvas, true);

        _gameEngine = new THEGAME.Engine(engine);

        var scene = _gameEngine.createScene(engine);
        scene.activeCamera.attachControl(canvas);
    }

document.getElementById("btnCopyBones").onclick = function () {
    _gameEngine.createSkeletonCopy();
}


function handleCopyBones() {
    _gameEngine.createSkeletonCopy();
}

