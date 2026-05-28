const tokens = document.querySelectorAll('.token')
const token1 = document.querySelector('.token-1')
const token2 = document.querySelector('.token-2')
const token3 = document.querySelector('.token-3')
const lights = document.querySelectorAll('.light')
let solved = false

tokens.forEach(token => {
    token.addEventListener('click', function () {
        const current = this.getAttribute('rotation')
        this.setAttribute('rotation', {
            y: current.y + 20,
            x: current.x,
            z: current.z
        })
        function almost(a, b) {
            return Math.abs(a - b) < 0.1
        }

        if (almost(token1.getAttribute('rotation').y, 20)
            && almost(token2.getAttribute('rotation').y, 40)
            && almost(token3.getAttribute('rotation').y, 60)) {
            console.log('clear puzzle')
            solved = true

            lights.forEach(light => {
                light.setAttribute('color', '#FFF')
            })
        }
    })
})

console.log('inside js file')
