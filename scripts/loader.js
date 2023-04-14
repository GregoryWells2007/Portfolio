function readFile(file) {
    return new Promise((resolve, reject) => {
      let fr = new FileReader();
      fr.onload = x=> resolve(fr.result);
      fr.readAsText(file);
})}


async function loader_loadshader(path) {
    var file = await fetch("https://gregorywells2007.github.io/Portfolio/" + path);
    var data = await file.text();
    
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
