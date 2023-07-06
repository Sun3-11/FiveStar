function previewMultiple(event) {
    var images = document.getElementById("image");
    var number = images.files.length;
    for (i = 0; i < number; i++) {
        var urls = URL.createObjectURL(event.target.files[i]);
        document.getElementById("formFile").innerHTML += '<img src="' + urls + '">';
    }
}
function previewMultiple2(e) {
    var images = document.getElementById("avatarSrc");
    var number = images.files.length;
    for (i = 0; i < number; i++) {
        var urls = URL.createObjectURL(e.target.files[i]);
        document.getElementById("formFile2").innerHTML += '<img src="' + urls + '">';
    }
}