var ORIGIN_PATH = "/";

async function readFile(path) {
    var file = await fetch(ORIGIN_PATH + path);
    var data = await file.text();
    return data;
} 


async function loader_loadshader(path) {    
    var data = await readFile(path);

    var datas = [];
    var thing = "";

    var file_lines = data.split("\n");
    for (var k = 0; k < file_lines.length; k++) {
        if (file_lines[k].includes("#Start")) {
            var data_start = {"Name":file_lines[k].substring(6),"Data":""}
            thing = data_start.Name;
            datas[datas.length] = data_start; 
            continue;
        }

        for (var g = 0; g < datas.length; g++) {
            if (datas[g].Name == thing) {
                datas[g].Data += file_lines[k] + "\n";
            }
        }
    }

    function shader_text_data(dat) {
        this.dat = dat;
        this.get = function(name) {
            for (var f = 0; f < this.dat.length; f++) 
                if (this.dat[f].Name == name)
                    return this.dat[f].Data;
        }
    }

    return new shader_text_data(datas);
}

async function load_loadobj(path) {
    var data = await readFile(path);

    var verts = [];
    var normals = [];
    var texs = [];

    var final_verts = [];
    var final_tris = [];

    var file_lines = data.split("\n");
    var index = 0;
    for (var i = 0; i < file_lines.length; i++) {
        var line = file_lines[i];
        if (line[0] == 'v') {
            if (line[1] == 'n') {
                var line_data = line.split(" ");
                var new_norm = new Vec3(parseFloat(line_data[1]), parseFloat(line_data[2]), parseFloat(line_data[3]));
                normals[normals.length] = new_norm;
            } else if (line[1] == "t") {
                var line_data = line.split(" ");
                var new_tex = new Vec2(parseFloat(line_data[1]), parseFloat(line_data[2]));
                texs[texs.length] = new_tex;                
            } else {
                var line_data = line.split(" ");
                var new_vert = new Vec3(parseFloat(line_data[1]), parseFloat(line_data[2]), parseFloat(line_data[3]));
                verts[verts.length] = new_vert;
            }
        } 

        if (line[0] == "f") {
            var line_data = line.split(" ");
            var vert1 = line_data[1].split("/");
            var vert2 = line_data[2].split("/");
            var vert3 = line_data[3].split("/");

            var new_vert1 = [];
            new_vert1[0] = verts[parseInt(vert1[0]) - 1];
            new_vert1[1] = texs[parseInt(vert1[1]) - 1];
            new_vert1[2] = normals[parseInt(vert1[2]) - 1];

            var new_vert2 = [];
            new_vert2[0] = verts[parseInt(vert2[0]) - 1];
            new_vert2[1] = texs[parseInt(vert2[1]) - 1];
            new_vert2[2] = normals[parseInt(vert2[2]) - 1];

            var new_vert3 = [];
            new_vert3[0] = verts[parseInt(vert3[0]) - 1];
            new_vert3[1] = texs[parseInt(vert3[1]) - 1];
            new_vert3[2] = normals[parseInt(vert3[2]) - 1];

            final_verts[final_verts.length] = new_vert1;
            final_verts[final_verts.length] = new_vert2;
            final_verts[final_verts.length] = new_vert3;

            final_tris[final_tris.length] = index;
            index++;
            final_tris[final_tris.length] = index;
            index++;
            final_tris[final_tris.length] = index;
            index++;
        }
    }

    function mesh_data(verts, tris) {
        this.verts = verts;
        this.tris = tris;

        this.get = function(name) {
            if (name == "verts")
                return this.verts;
            else if (name == "tris")
                return this.tris;
            else if (name == "vertlayout")
                return ["Vec3","Vec2","Vec3"]
        }
    }

    return new mesh_data(final_verts, final_tris);
}