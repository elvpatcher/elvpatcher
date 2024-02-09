var web = null;
new QWebChannel(qt.webChannelTransport, function (channel) {
    web = channel.objects.web;
});

let slideIndex = [1,1];
let slideId = ["b-slide", "s-slide"]
showSlides(1, 0);
showSlides(1, 1);

function plusSlides(n, no) {
    showSlides(slideIndex[no] += n, no);
}

function showSlides(n, no) {
    let i;
    let x = document.getElementsByClassName(slideId[no]);
    if (n > x.length) {slideIndex[no] = 1}    
    if (n < 1) {slideIndex[no] = x.length}
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";  
    }
    x[slideIndex[no]-1].style.display = "block";  
}

function init_translation() {
    var elements = Array.prototype.slice.call(document.querySelectorAll('[data-locale]'));
    elements.forEach(function(element) {
        web.WebGetTranslation(element.dataset.locale, function (result) {
            element.innerHTML = result;
        })
    });

    var elements2 = Array.prototype.slice.call(document.querySelectorAll('[data-title]'))
    elements2.forEach(function(element) {
        web.WebGetTranslation(element.dataset.title, function (result) {
            element.title = result;
        });
    });
}

var auto_start = -1;
function countdownStartGame(seconds) {
    auto_start = seconds;
    setTimeout(function() {
        if (auto_start == -1)
            return;
        
        var btn = document.querySelector("[data-locale='start_game']");
        auto_start -= 1;
        if (!auto_start) {
            btn.click();
            return;
        }
        
        web.WebGetTranslation(btn.dataset.locale, function (result) {
            btn.innerHTML = result + "(" + auto_start + ")";
        });
        countdownStartGame(auto_start);
    }, 1000);
}

function init() {
    setTimeout(function() {
        if (typeof web !== 'undefined' && web != null) {
            web.SetTranslations(JSON.stringify(localization));
            init_translation();
            return;
        }
        init();
    }, 100);
}

function SetLanguage(lang) {
    web.SetLanguage(lang, function() {
        init_translation();
    });
}

init();

document.addEventListener('touchstart', function(event){
    event.preventDefault();
}, {passive: false});