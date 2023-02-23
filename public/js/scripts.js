const income = document.querySelector('#income_form_home')
const expense = document.querySelector('#expense_form_home')
const legend = document.querySelector('#legend')


function changeTitle() {
    if ( income.checked ) {
        legend.textContent = 'Receita'

    } else if ( expense.checked ) {
        legend.textContent = 'Despesa'
    }
}