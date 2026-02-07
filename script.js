const allElems = document.querySelectorAll('.elem');
const allFullElems  = document.querySelectorAll('.fullElem');
const backBtns = document.querySelectorAll('.back');


function hideAll() {
    allFullElems.forEach(section => {
        section.classList.remove('active');
    });
}

// open section
allElems.forEach((elem, index) => {
    elem.addEventListener('click', () => {
        hideAll();
        allFullElems[index].classList.add('active');
    });
});

// back button close
backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        hideAll();
    });
});

//

