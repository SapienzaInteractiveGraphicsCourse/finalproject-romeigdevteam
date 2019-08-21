for (var i in meshes) {
    if (meshes[i].lengh > 1) //array
    {

        for (var j = 0; j < meshes[i].lenght; j++) {
            meshes[i][j].position = boxes[i][j].position
        }
    }
    else {
        meshes[i].position = boxes[i].position
    }
}