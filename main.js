let startTime = 0
let timerId = 0
let timeToAdd = 0
let lastTime = 0
let notes = []
let runningStatus = 0 //0: not_started, 1: running, 2: stopping, 4: finished

function millisecondsToTime(millisec) {
    const m = Math.floor(millisec / 60000)
    const s = Math.floor(millisec % 60000 / 1000)
    const ms = Math.floor(millisec % 1000)
    return "00:" + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + '.' + String(ms).padStart(3, '0')
}

function countUp() {
    timerId = setTimeout(function () {
        const elapsedTime = Date.now() - startTime + timeToAdd
        document.getElementById("timer").innerText = millisecondsToTime(elapsedTime)
        countUp()
    }, 10)
}

const start = () => {
    const notesEl = document.getElementById("notes")
    const notesArray = notesEl.value.split("\n").filter(x => x !== "")
    if (notesArray.length === 0) {
        notesEl.focus()
    } else {
        switch (runningStatus) {
            case 0: // not_started
            case 4: // finished
                timeToAdd = 0
                document.getElementById("timer").innerText = millisecondsToTime(0)
                document.getElementById("logs").innerHTML = ""
                notes = notesArray.map((x, i) => [i + 1, x])
                document.getElementById("currNote").innerText = notes[0][0] + ", " + notes[0][1]
                if (notes.length > 1) {
                    document.getElementById("nextNote").innerText = notes[1][0] + ", " + notes[1][1]
                }
                notesEl.disabled = true

                document.getElementById("mainButton").disabled = true
                document.getElementById("stopButton").disabled = false
                //document.getElementById("prevButton").disabled = false
                document.getElementById("nextButton").disabled = false

                runningStatus = 1 // running
                console.log("running_status: " + ["0: not_started", "1: running", "2: stopping", "", "4: finished"][runningStatus])

                startTime = Date.now()
                lastTime = startTime
                countUp()
                break
            case 1: // running
                break
            case 2: // stopping
                document.getElementById("mainButton").disabled = true
                document.getElementById("stopButton").disabled = false
                //document.getElementById("prevButton").disabled = false
                document.getElementById("nextButton").disabled = false
                notesEl.disabled = true

                runningStatus = 1 // running
                console.log("running_status: " + ["0: not_started", "1: running", "2: stopping", "", "4: finished"][runningStatus])

                startTime = Date.now()
                lastTime = startTime
                countUp()
                break
        }
    }
}

document.getElementById("mainButton").onclick = start

const stop = () => {
    switch (runningStatus) {
        case 1: // running
            clearTimeout(timerId)
            timeToAdd += Date.now() - startTime

            document.getElementById("notes").disabled = false
            document.getElementById("mainButton").disabled = false
            document.getElementById("stopButton").disabled = true
            //document.getElementById("prevButton").disabled = true
            document.getElementById("nextButton").disabled = true

            runningStatus = 2 // stopping
            console.log("running_status: " + ["0: not_started", "1: running", "2: stopping", "", "4: finished"][runningStatus])
            break
    }
}

document.getElementById("stopButton").onclick = stop

const reset = () => {
    switch (runningStatus) {
        case 1: // running
            stop()
            break
        case 2: // stopping
        case 4: // finished
            document.getElementById("currNote").innerText = ""
            document.getElementById("nextNote").innerText = ""
            document.getElementById("logs").innerText = ""

            timeToAdd = 0
            timer.innerText = millisecondsToTime(0)

            document.getElementById("mainButton").disabled = false
            runningStatus = 0 // not_started
            console.log("running_status: " + ["0: not_started", "1: running", "2: stopping", "", "4: finished"][runningStatus])
            break
    }
}

document.getElementById("resetButton").onclick = reset

const next = () => {
    switch (runningStatus) {
        case 0: // not_started
            start()
            break
        case 1: // running
            const logs = document.getElementById("logs")
            logs.innerHTML = logs.innerHTML.split("<br>").filter(x => x !== "").concat([notes[0][0] + ", " + millisecondsToTime(Date.now() - lastTime) + ", " + notes[0][1]]).join("<br>")
            lastTime = Date.now()

            if (notes.length === 1) {
                logs.innerHTML = logs.innerHTML.split("<br>").filter(x => x !== "").concat(["TOTAL, " + document.getElementById("timer").innerText + ", END"]).join("<br>")
                document.getElementById("currNote").innerText = ""
                stop()
                document.getElementById("mainButton").disabled = false

                runningStatus = 4 // finished
                console.log("running_status: " + ["0: not_started", "1: running", "2: stopping", "", "4: finished"][runningStatus])
            } else {
                notes = notes.slice(1)
                document.getElementById("currNote").innerText = notes[0][0] + ", " + notes[0][1]
                if (notes.length > 1) {
                    document.getElementById("nextNote").innerText = notes[1][0] + ", " + notes[1][1]
                } else {
                    document.getElementById("nextNote").innerText = ""
                }
            }
            break
    }
}

document.getElementById("nextButton").onclick = next

window.addEventListener("keydown", (event) => {
    const key = event.key
    const notesEl = document.getElementById("notes")

    if (document.activeElement === notesEl) {
        if (key === "Escape") {
            notesEl.blur()
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
            case "\\":
                notesEl.focus()
                event.preventDefault()
                break
        }
    }
})

document.getElementById("timer").innerText = millisecondsToTime(0)
document.getElementById("mainButton").title = "Start watch (Enter)"
document.getElementById("stopButton").title = "Stop watch (Escape)"
document.getElementById("stopButton").disabled = true
document.getElementById("resetButton").title = "Reset watch and logs (Delete)"
document.getElementById("prevButton").disabled = true
document.getElementById("prevButton").title = "Previous note (<)"
document.getElementById("nextButton").disabled = true
document.getElementById("nextButton").title = "Next note (>)"
document.getElementById("notes").title = "Type or paste notes to see while speaking or something. (\\)"
console.log("running_status: " + ["0: not_started", "1: running", "2: stopping", "", "4: finished"][runningStatus])
alert('A new version is available at\ncronota (https://taidalog.github.io/cronota/).\nThis page will no longer maintained.\nThank you!')