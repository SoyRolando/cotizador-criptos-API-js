//! Variables
const criptosSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const objBusqueda = {
    moneda: '',
    criptomoneda: '',
}

window.onload = () => {
    consultarCriptos();
    criptosSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
    formulario.addEventListener('submit', validarFormulario);
};


//! Funciones

function consultarCriptos() {

    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=100&tsym=USD';

    fetch(url)
        .then(answer => answer.json())
        .then(criptosTop => mostrarCriptosSelect(criptosTop.Data))
}

function mostrarCriptosSelect(criptosTop = []) {

    criptosTop.forEach(criptos => {
        const { CoinInfo: { FullName, Name } } = criptos;
        const select = document.createElement('OPTION');
        select.textContent = FullName;
        select.value = Name;
        criptosSelect.appendChild(select);
    })
}

function validarFormulario(e) {
    e.preventDefault();

    // Validar
    const { moneda, criptomoneda } = objBusqueda;
    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son oligatorios');
        return;
    }
    consultarCambioCripto();
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function mostrarAlerta(mensaje) {

    const existeError = document.querySelector('.error');

    if (!existeError) {
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('error');
        divMensaje.textContent = mensaje;

        resultado.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 2000);
        return;
    }

}

function consultarCambioCripto() {

    const { moneda, criptomoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    mostrarSpinner();
    fetch(url)
        .then(answer => answer.json())
        .then(datos => mostrarResultado(datos.DISPLAY[criptomoneda][moneda]))
}

function mostrarResultado(datos) {

    limpiarHTML(resultado);

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = datos;

    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es: <span> ${PRICE}</span>`;

    const precioAlto = document.createElement('P');
    precioAlto.innerHTML = `<p>Precio más alto del día: <span> ${HIGHDAY}</span></p>`;

    const precioBajo = document.createElement('P');
    precioBajo.innerHTML = `<p>Precio más bajo del día: <span> ${LOWDAY}</span></p>`;

    const ultimasHoras = document.createElement('P');
    ultimasHoras.innerHTML = `<p>Variación últimas 24h: <span> ${CHANGEPCT24HOUR} %</span></p>`;

    const actualizacion = document.createElement('P');
    actualizacion.innerHTML = `<p>Última Actualización: <span> ${LASTUPDATE}</span></p>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(actualizacion);
}

function limpiarHTML(contenedor) {
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }
}

function mostrarSpinner(){

    limpiarHTML(resultado);

    const spinner = document.createElement('DIV');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;
    resultado.appendChild(spinner);
}


// API para criptos mas impotantes: https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD
