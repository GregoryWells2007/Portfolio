var gl = null;
var canvas = null;

function Shader(path) {
    this.path = path;
    this.load = async function() {
        this.shader_source = await loader_loadshader(path);
        this.shaderID = createShader(this.shader_source.get("Vertex"), this.shader_source.get("Fragment"));
    }
}

function Mesh(shader, verts, vert_layout) {
    this.shader = shader;
    this.verts = verts;
    this.vert_layout = vert_layout;
    this.load = function() {
        this.vertex_array = gl.createVertexArray();
        gl.bindVertexArray(this.vertex_array);

        this.vert_buffers = new Array(this.vert_layout.length);

        for (var i = 0; i < this.vert_layout.length; i++) {
            var data = []; 
            for (var k = 0; k < this.verts.length; k++) {
                if (this.vert_layout[i] == "Vec3") {
                    data[data.length] = this.verts[k][i].x;
                    data[data.length] = this.verts[k][i].y;
                    data[data.length] = this.verts[k][i].z;
                }
            }

            this.vert_buffers[i] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vert_buffers[i]);

            if (this.vert_layout[i] == "Vec3") {
                console.log(data);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
                gl.enableVertexAttribArray(i);
                gl.vertexAttribPointer(i, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
            }
        }
    }

    this.draw = function() {
        
        gl.useProgram(this.shader.shaderID);
        gl.bindVertexArray(this.vertex_array);
        
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
}

function createShader(vertShader, fragShader) {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertShader);
    gl.shaderSource(fragmentShader, fragShader);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.log("ERROR compiling vertex shader!", gl.getShaderInfoLog(vertexShader));
    }
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.log("ERROR compiling fragment shader!", gl.getShaderInfoLog(fragmentShader));
    }

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.log("ERROR linking program", gl.getProgramInfoLog(shaderProgram));
    }

    return shaderProgram;
}

async function init_renderer() {
    canvas = document.getElementById("body_world");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


    gl = canvas.getContext("webgl2");

    if (!gl) {
        console.log("you are an enjoyer of men");
        gl = canvas.getContext("experimental-webgl");
    }

    if (!gl) {
        alert("your browser does not support webgl you need to get a better brower bozo");
    }

    requestAnimationFrame(draw_to_renderer);
}

function draw_to_renderer() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    gl.clearColor(0.08, 0.08, 0.12, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    draw_world();

    requestAnimationFrame(draw_to_renderer);
}