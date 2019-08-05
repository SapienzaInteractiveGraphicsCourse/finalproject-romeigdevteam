(function() {
  'use strict';
  window.sceneNS = window.sceneNS || {};
  window.addEventListener('DOMContentLoaded', function () {

    let canvas =document.getElementById('renderCanvas');
    let scene = window.sceneNS.sceneCreate(canvas, engine);
    engine.runRenderLoop(function() {
      scene.render();
    });
    window.addEventListener('resize', function() {
      engine.resize();
    });
  });

}());
