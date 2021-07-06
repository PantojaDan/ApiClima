document.addEventListener("DOMContentLoaded",()=>{


    /*Decalracion de variables*/
    const formulario = document.querySelector("#form");
    const contenedor = document.querySelector(".container");
    const campoPaises = document.querySelector("#paises");
    const campoCiudad = document.querySelector("#ciudad");

    /*Esuchando eventos*/
    formulario.addEventListener("submit",validarCampos);

    /*Declarando funciones*/
    function validarCampos(e){
        e.preventDefault();
        mostrarSpinner();
        const error = document.querySelector(".error");

        if(campoCiudad.value=="" || campoPaises.value ==""){
            
            if(!error){

                mostrarMensaje("Todos los campos son obligatorios");

            }

            return;
        }
        eliminarHTML();
        consultarAPI(campoPaises.value,campoCiudad.value);
    }

    function mostrarSpinner(){
        const spinnerDiv = document.createElement("div");
        const boton = document.querySelector("button");

        spinnerDiv.classList.add("spinner");
        boton.remove();
        formulario.appendChild(spinnerDiv);

        setTimeout(() => {
            spinnerDiv.remove();

            const btn = document.createElement("button");
            btn.textContent = "Consultar";
            formulario.appendChild(btn);
        }, 400);
    }

    function mostrarMensaje(mnsg){
        const errorDiv = document.createElement("div");
        errorDiv.classList.add("error");
        errorDiv.textContent = mnsg;

        contenedor.appendChild(errorDiv);

        setTimeout(()=>{
            errorDiv.remove();
        },3000);
    }

    function consultarAPI(pais,ciudad){
        const apiId = "84d70eb0548ae3641b62fbc3332ef7a1";

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${apiId}`;

        fetch(url)
            .then(respuesta => respuesta.json())
            .then(datos => mostrarDatos(datos))
    }

    function mostrarDatos(datos){
        if(datos.cod =="404"){
            mostrarMensaje("Ubicacion invalida");
            return;
        }

        const {main:{temp,temp_min,temp_max},name,weather} = datos;

        const temperatura = parseInt(temp - 273.15);
        const temperaturaMin = parseInt(temp_min - 273.15);
        const temperaturaMax = parseInt(temp_max - 273.15);


        if(weather[0].main == "Clouds"){
            insertarDatos(temperatura,temperaturaMin,temperaturaMax,name,"Nubes","clouds.png");
        }
        if(weather[0].main == "Hize"){
            insertarDatos(temperatura,temperaturaMin,temperaturaMax,name,"Neblina","hize.png");
        }
        if(weather[0].main == "Clear"){
            insertarDatos(temperatura,temperaturaMin,temperaturaMax,name,"Despejado","clear.png");   
        }
        if(weather[0].main == "Rain"){
            insertarDatos(temperatura,temperaturaMin,temperaturaMax,name,"Lluvia","rain.png"); 
        }
        
    }

    function insertarDatos(temp,temp_min,temp_max,name,weather,imagen){
        const resultado = document.querySelector("#resultado");
        resultado.classList.add("resultado");
        resultado.innerHTML = `
            
                <div class="temperatura">
                    <h1>${name}</h1>
                    <h2>${temp}&#8451</h2>
                    <div><h4>Min: ${temp_min}&#8451</h4><h4>Max: ${temp_max}&#8451</h4></div>
                </div>
                <div class="clima">
                    <div><h4>${weather}</h4></div>
                    <img src="${imagen}" alt="${imagen}">
                </div>
           
        `;
        /*AQUI ME QUEDE, HAY QUE BORRAR EL HTML CADA QUE SE INSERTE LOS DATOS */
        contenedor.insertBefore(resultado,document.querySelector(".formulario"));
    }

    function eliminarHTML(){
        const resultado = document.querySelector("#resultado");
        resultado.classList.remove("resultado");
        while(resultado.firstChild){
            resultado.removeChild(resultado.firstChild);
        }
    }

});
