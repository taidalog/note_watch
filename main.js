let startTime = 0
let elapsedTime = 0
let timerId = 0
let timeToAdd = 0
let lastTime = 0
let questions = []

function millisecondsToTime(millisec) {
    const m = Math.floor(millisec / 60000)
    const s = Math.floor(millisec % 60000 / 1000)
    const ms = Math.floor(millisec % 1000)
    return "00'" + String(m).padStart(2, '0') + '"' + String(s).padStart(2, '0') + '.' + String(ms).padStart(3, '0')
}

function countUp() {
    timerId = setTimeout(function () {
        elapsedTime = Date.now() - startTime + timeToAdd
        document.getElementById("timer").innerText = millisecondsToTime(elapsedTime)
        countUp()
    }, 10)
}

const start = () => {
    questions = document.getElementById("questions").value.split("\n")
    document.getElementById("currQ").innerText = questions[0]
    document.getElementById("nextQ").innerText = questions[1]

    startTime = Date.now()
    lastTime = startTime
    countUp()
}

document.getElementById("mainButton").onclick = start

const stop = () => {
    clearTimeout(timerId)
    timeToAdd += Date.now() - startTime
}

document.getElementById("stopButton").onclick = stop

const reset = () => {
    questions = document.getElementById("questions").value.split("\n")
    document.getElementById("currQ").innerText = ""
    document.getElementById("nextQ").innerText = ""
    document.getElementById("output").innerText = ""
    elapsedTime = 0
    timeToAdd = 0
    timer.innerText = millisecondsToTime(elapsedTime)
}

document.getElementById("resetButton").onclick = reset

const next = () => {
    const output = document.getElementById("output")
    output.innerHTML = output.innerHTML.split("<br>").filter(x => x !== "").concat([millisecondsToTime(Date.now() - lastTime) + ", " + questions[0]]).join("<br>")
    lastTime = Date.now()

    if (questions.length === 1) {
        output.innerHTML = output.innerHTML.split("<br>").filter(x => x !== "").concat([document.getElementById("timer").innerText + ", END"]).join("<br>")
        document.getElementById("currQ").innerText = ""
    } else {
        questions = questions.slice(1)
        document.getElementById("currQ").innerText = questions[0]
        if (questions.length > 1) {
            document.getElementById("nextQ").innerText = questions[1]
        } else {
            document.getElementById("nextQ").innerText = ""
        }
    }
}

document.getElementById("nextButton").onclick = next

window.addEventListener("keydown", (event) => {
    const key = event.key
    const questionsEl = document.getElementById("questions")

    if (document.activeElement === questionsEl) {
        if (key === "Escape") {
            questionsEl.blur()
        }
    } else {
        console.log(key)
        switch (key) {
            case "Enter":
                start()
                break
            case "Escape":
                stop()
                break
            case "Delete":
                reset()
                break
            case "ArrowRight":
                next()
                break
            case "ArrowLeft":
                break
        }
    }
})

document.getElementById("timer").innerText = millisecondsToTime(0)