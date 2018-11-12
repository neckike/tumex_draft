// Get the modal
var modalparent = document.getElementsByClassName("modal_multi");

// Get the button that opens the modal
var modal_btn_multi = document.getElementsByClassName("myBtn_multi");

// When the user clicks the button, open the modal
function setDataIndex() {

    for (i = 0; i < modal_btn_multi.length; i++){
        modal_btn_multi[i].setAttribute('data-index', i);
        modalparent[i].setAttribute('data-index', i);
    }
}

for (i = 0; i < modal_btn_multi.length; i++){
    modal_btn_multi[i].onclick = function() {
        var ElementIndex = this.getAttribute('data-index');
        modalparent[ElementIndex].style.display = "block";
    };
}

window.onload = function() {
    setDataIndex();
};

window.onclick = function(event) {
    if (event.target === modalparent[event.target.getAttribute('data-index')]){
        modalparent[event.target.getAttribute('data-index')].style.display = "none";
    }
};
