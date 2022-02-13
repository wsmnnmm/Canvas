let canvas = document.getElementById("canvas");
canvas.width = document.documentElement.clientWidth
canvas.height = document.documentElement.clientHeight
let ctx = canvas.getContext("2d");
ctx.fillStyle = "black";
ctx.strokeStyle = 'black';
let painting = false;
let last;
ctx.lineWidth = 8
ctx.lineCap = 'round';

on('click', '.colors', 'li', (e) => {
    let parentChildren = e.target.parentElement.children
    for (let i = 0; i < parentChildren.length; i++) {
        if (parentChildren[i] !== e.target) {
            parentChildren[i].classList.remove("selected")
        }
    }
    e.target.classList.add("selected")
    //点击擦除时
    if (e.target.id === "white") {
        ctx.fillStyle = "white"
        ctx.strokeStyle = "white"
        ctx.lineWidth = 24
        return
    }
    //点击下载图片时
    if (e.target.id === "download") {
        canvas.toBlob(function (blob) {
            saveAs(blob, 'canvas')
        });
        return
    }
    ctx.fillStyle = e.target.id;
    ctx.strokeStyle = e.target.id;
    ctx.lineWidth = 8;
})
function on(eventType, element, selector, fn) {
    if (!(element instanceof Element)) {
        element = document.querySelector(element)
    }
    element.addEventListener(eventType, e => {
        let el = e.target
        while (!el.matches(selector)) {
            if (element === el) {
                el = null
                break
            }
            el = el.parentNode
        }
        el && fn.call(el, e, el)
    })
    return element
}

var isTouchDevice = 'ontouchstart' in document.documentElement;
if (isTouchDevice) {
    canvas.ontouchstart = (e) => {
        let x = e.touches[0].clientX
        let y = e.touches[0].clientY
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        last = [x, y]
    }
    canvas.ontouchmove = (e) => {
        let x = e.touches[0].clientX
        let y = e.touches[0].clientY
        drawLine(last[0], last[1], x, y)
        last = [x, y]
    }
} else {
    canvas.onmousedown = (e) => {
        painting = true;
        ctx.beginPath();
        ctx.arc(e.clientX, e.clientY, 1, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        last = [e.clientX, e.clientY]
    }
    canvas.onmousemove = (e) => {
        if (painting === true) {
            drawLine(last[0], last[1], e.clientX, e.clientY)
            last = [e.clientX, e.clientY]
        }
    }
    canvas.onmouseup = () => {
        painting = false;
    }
}
function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke();
}
