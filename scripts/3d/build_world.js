var CubeMesh;
var CubeBackground;

var CubeShader;

var transform;

var hex_positions = [];
var real_background_position = -100;
var real_hex_z_positions = [];

var buttons = [];

var frame_count = 0;
setInterval(function() {
    console.log(frame_count);
    frame_count = 0;
}, 1000)

async function buildMesh() {
    for (var k = 0; k < 4; k++) {
        buttons[k] = document.getElementById("Button" + (k + 1));
    }

    CubeShader = new Shader("shaders/basic.glsl");
    await CubeShader.load();
    CubeShader.SetUniform("viewMatrix", "Mat4", GenViewMatrix());
    CubeShader.SetUniform("cameraMatrix", "Mat4", GenCameraMatrix(45, window.innerWidth / window.innerHeight, 0.1, 1000));

    var model = await load_loadobj("models/hex.obj");
    var eicModel = await load_loadobj("models/background.obj");

    CubeBackground = new Mesh(CubeShader,
        eicModel.get("verts"), 
        eicModel.get("tris"),
        eicModel.get("vertlayout")       
    );
    CubeBackground.load();

    CubeMesh = new Mesh(CubeShader, 
    model.get("verts"), 
    model.get("tris"),
    model.get("vertlayout")
    );
    CubeMesh.load();

    GenRandomPositions();
}

var screen_cuttof;

function GenRandomPositions() {
    var screen_dimensions = window.innerWidth / window.innerHeight;

    for (var k = 0; k < 4; k++) {
        //var zPosition = -(5 + Math.random());
        var zPosition = -5;
        screen_cuttof = screen_dimensions * 6;
        var xPosition = (Math.random() * screen_cuttof) - (screen_cuttof / 2);
        hex_positions[k] = new Vec3(xPosition, -9, zPosition);
        // -9 + (Math.random() * 2)

        real_hex_z_positions[k] = -100;
    }

    var fix = false;
    for (var a = 0; a < 4; a++) {
        for (var b = 0; b < 4; b++) {
            if (a == b)
                continue;

            var hexa = hex_positions[a];
            var hexb = hex_positions[b];

            if (get_distance(new Vec2(hexa.x, hexa.z), new Vec2(hexb.x, hexb.z)) < 1) {
                fix = true;
                break;
            }   

            if (Math.abs((hexa.x - hexb.x)) < screen_cuttof / 5) {
                fix = true;
                break;
            }            
        }
    }
    if (fix) {
        GenRandomPositions();
    }
}

async function build_world() {
    await buildMesh();  
    transform = new Transform(new Vec3(0, -9, -7), new Vec3(40, 0, 0), new Vec3(0.2, 10, 0.2))
}

function draw_world() {
    frame_count++;

    CubeShader.SetUniform("lightPosition", "Vec3", new Vec3(0, -9, -9));
    CubeShader.SetUniform("lightColor", "Vec3", new Vec3(1.0, 1.0, 1.0));

    
    for (var k = 0; k < hex_positions.length; k++) {
        CubeShader.SetUniform("modelColor", "Vec3", new Vec3(1.0, 0.0, 0.0));

        var xPercent = k / 3;  
        xPercent = (xPercent * 2) - 1;
        xPercent *= 4;

        var screenPercent = k / 3;  
        screenPercent = (screenPercent * 2) - 1;
        screenPercent *= 37;
        var screenPercentReal = screenPercent + 50;

        buttons[k].style.setProperty("--left-percent", screenPercentReal + "%");

        real_hex_z_positions[k] += Math.abs(((real_hex_z_positions[k] - hex_positions[k].y) / 100))
        transform = new Transform(new Vec3(xPercent, real_hex_z_positions[k], 0), new Vec3(0, hex_positions[k].z, 0), new Vec3(0.2, 0.8, 0.2))
        hex_positions[k].z += 0.1;
        CubeShader.SetUniform("translationMatrix", "Mat4", transform.BuildMatrix());

        CubeMesh.draw();
    }

    var final_bg_position = -5;

    transform = new Transform(new Vec3(0, real_background_position, -10), new Vec3(0, 90, 0), new Vec3(1, 5, 6))
    CubeShader.SetUniform("modelColor", "Vec3", new Vec3(0.0, 1.0, 0.0));
    CubeShader.SetUniform("translationMatrix", "Mat4", transform.BuildMatrix());
    CubeBackground.draw();
    real_background_position += Math.abs(real_background_position - final_bg_position) / 75
}