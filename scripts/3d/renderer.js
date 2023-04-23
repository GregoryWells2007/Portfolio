var gl = null;
var canvas = null;

function Texture(path) {
    this.path = path;
    this.load = async function() {
        const img = new Image();
        img.onload = function() {
            const tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tex);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
            gl.generateMipmap(gl.TEXTURE_2D);
        };
        img.src = path;
    }
}

function Shader(path) {
    this.path = path;
    this.load = async function() {
        this.shader_source = await loader_loadshader(path);
        this.shaderID = createShader(this.shader_source.get("Vertex"), this.shader_source.get("Fragment"));
    }

    this.SetUniform = function(name, type, value) {
        if (typeof this.shaderID == "undefined")
            return;
        gl.useProgram(this.shaderID);
        let unfiromLocation = gl.getUniformLocation(this.shaderID, name);

        if (type == "Mat4") {
            gl.uniformMatrix4fv(unfiromLocation, gl.FALSE, value);
        } else if (type == "Vec3") {
            gl.uniform3f(unfiromLocation, value.x, value.y, value.z);
        }else {
            console.log("ADD THIS SHIT IN ME IM LAZY AF");
        }
    }
}

function GenCameraMatrix(fov, detail, near_clip, far_clip) {
    let cameraMatrix = new Float32Array(16);
    glMatrix.mat4.identity(cameraMatrix);
    glMatrix.mat4.perspective(cameraMatrix, glMatrix.glMatrix.toRadian(fov), -detail, near_clip, far_clip);
    return cameraMatrix;
}

function GenViewMatrix() {
    let cameraMatrix = new Float32Array(16);
    glMatrix.mat4.identity(cameraMatrix);
    //glMatrix.mat4.lookAt(cameraMatrix, [0, , 20], [0, 0, 0], [0, 1, 0]);
    glMatrix.mat4.lookAt(cameraMatrix, [0, 0, 10], [0, 0, 0], [0, 1, 0]);
    return cameraMatrix; 
}

function Transform(pos, rot, scl) {
    this.position = pos;
    this.rotation = rot;
    this.scale = scl;

    this.BuildMatrix = function() {
        var matrix = new Float32Array(16);
        var q = glMatrix.quat.create();
        glMatrix.quat.rotateX(q, q, glMatrix.glMatrix.toRadian(this.rotation.x));
        glMatrix.quat.rotateY(q, q, glMatrix.glMatrix.toRadian(this.rotation.y));
        glMatrix.quat.rotateZ(q, q, glMatrix.glMatrix.toRadian(this.rotation.z));

        glMatrix.mat4.identity(matrix);
        glMatrix.mat4.fromRotationTranslationScale(matrix, q, [this.position.x, this.position.y, this.position.z], [this.scale.x, this.scale.y, this.scale.z]);
        return matrix;
    }
}

function Mesh(shader, verts, tris, vert_layout) {
    this.shader = shader;
    this.verts = verts;
    this.tris = tris;
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
                } else if (this.vert_layout[i] == "Vec2") {
                    data[data.length] = this.verts[k][i].x;
                    data[data.length] = this.verts[k][i].y;                       
                }else {
                    console.log("ADD THIS SHIT IN ME IM LAZY AF");
                }
            }

            this.vert_buffers[i] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vert_buffers[i]);

            if (this.vert_layout[i] == "Vec3") {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
                gl.enableVertexAttribArray(i);
                gl.vertexAttribPointer(i, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
            } else if (this.vert_layout[i] == "Vec2") {
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
                gl.enableVertexAttribArray(i);
                gl.vertexAttribPointer(i, 2, gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
            } else {
                console.log("ADD THIS SHIT IN ME IM LAZY AF");
            }
        }

        this.index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.tris),
            gl.STATIC_DRAW
        );
    }

    this.draw = function() {
        
        gl.useProgram(this.shader.shaderID);
        gl.bindVertexArray(this.vertex_array);
        
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.FRONT);        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer);
        gl.drawElements(gl.TRIANGLES, this.tris.length, gl.UNSIGNED_SHORT, 0);
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

    gl.clearColor(0.08, 0.08, 0.12, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function draw_to_renderer() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    gl.clearColor(0.08, 0.08, 0.12, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.disable(gl.BLEND);
    draw_world();

    requestAnimationFrame(draw_to_renderer);
}