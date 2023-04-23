async function init_app() {
    var name = document.getElementById('name').innerHTML;
    document.getElementById('name').innerHTML = "";
    await animate_intro(name);
}

async function animate_intro(name) {
    await writein(document.getElementById("name"), name);
    setTimeout(function() {
        document.getElementById("name").classList.add("totop");
        setTimeout(function() {
            document.getElementById("bottom_text").classList.add("fadebelow");
        }, 1000)
    }, 250);
}

function load_type(name) {
    document.getElementById("main_page").classList.add("internal_clicked");
    document.getElementById(name + "_page").classList.remove('hide_page');
}

function load_back(name) {
    document.getElementById("main_page").classList.remove("internal_clicked");
    document.getElementById(name + "_page").classList.add('hide_page');   
}

function load_resume() {
    window.location.href = "https://docs.google.com/document/d/1csF9Cje_VuDDyOD11_QIDUmHgMioV5-gBjiPFEQOPa0/edit?usp=sharing";
}
