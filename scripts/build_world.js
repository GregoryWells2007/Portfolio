var CubeMesh;

function build_world() {
    var CubeShader = new Shader("shaders/basic.glsl");
    CubeShader.load();

    CubeMesh = new Mesh(CubeShader, [
        [new Vec3(-0.5, -0.5, +0.0), new Vec3(1.0, 0.0, 0.0)],
        [new Vec3(+0.5, -0.5, +0.0), new Vec3(0.0, 1.0, 0.0)],
        [new Vec3(+0.0, +0.5, +0.0), new Vec3(0.0, 0.0, 1.0)]
    ], ["Vec3", "Vec3"]);
    CubeMesh.load();
}

function draw_world() {
    CubeMesh.draw();
}