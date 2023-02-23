

class Validador {
    constructor() {
        const form = document.querySelector('.form')
        
        this.validacoes = [
            'data-required',
            'data-min-length',
            'data-max-length',
        ]
    }
    
    validacao(form) {
        let valid

        let correnteValidacoes = document.querySelectorAll('form .section-form__error')
        if (correnteValidacoes.length > 0) {
            this.limparValidacoes(correnteValidacoes)
        }

        let inputs = form.getElementsByTagName('input')
        let inputsArray = [...inputs]

        inputsArray.forEach((input) => {
            for (let i = 0; i < this.validacoes.length; i++) {

                if (input.getAttribute(this.validacoes[i]) === null) {
                    form.submit()
                } else {

                    let method = this.validacoes[i].replace('data-', '').replace('-', '')

                    let value = input.getAttribute(this.validacoes[i])

                    this[method](input, value)
                }
            }
        }, this)
    }

    required(input) {
        let inputValue = input.value

        if (inputValue === '') {
            let errorMsg = 'Preencha este campo'
            this.printMgs(input, errorMsg)
        }
    }
    minlength(input, minValue) {
        let inputLength = input.value.length

        if (inputLength < minValue) {
            let errorMsg = `O mínimo é de ${minValue} caracteres`

            this.printMgs(input, errorMsg)
        }
    }
    maxlength(input, maxValue) {
        let inputLength = input.value.length

        if (inputLength > maxValue) {
            let errorMsg = `O máximo é de ${maxValue} caracteres`

            this.printMgs(input, errorMsg)
        }
    }

    printMgs(input, msg) {
        let erros = input.parentNode.querySelector('.section-form__error')

        if (erros === null) {
            let template = document.querySelector('.section-form__error').cloneNode(true)
            let inputParent = input.parentNode

            template.textContent = msg

            template.classList.remove('section-form__error_display')

            inputParent.appendChild(template)
        }
    }

    limparValidacoes(correnteValidacoes) {
        correnteValidacoes.forEach(el => el.remove())
    }
}

//let validador = new Validador