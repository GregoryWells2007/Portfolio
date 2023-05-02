var text_fits = [];

function get_size(elem) {
    return {'X':elem.clientWidth, 'Y':elem.clientHeight}
}

function text_fitter(class_name) {
    var element_with_class_name = document.getElementsByClassName(class_name);
    for (let h = 0; h < element_with_class_name.length; h++) {
        let element = element_with_class_name[h];
        text_fits[text_fits.length] = {'Element':element,"DefaultSize":get_size(element),"CurrentFontSize":10};
    }
}

function update_fit() {
    for (let g = 0; g < text_fits.length; g++) {
        let current_fit = text_fits[g];
        var parent_size = get_size(current_fit.Element.parentElement);
        
        var relationX = current_fit.DefaultSize.X / parent_size.X; 
        var relationY = current_fit.DefaultSize.Y / parent_size.Y; 

        if (relationY < 0.75) {
            current_fit.CurrentFontSize += (1 - relationY);
        }        
        if (relationY > 1.1) {
            current_fit.CurrentFontSize = 0;
        }

        current_fit.Element.style.setProperty("--font-size", current_fit.CurrentFontSize + "px");
        current_fit.DefaultSize = get_size(current_fit.Element);
    }
}