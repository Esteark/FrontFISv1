(function () {
  const arrayOp = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const probtext = {
    alta: "Con una clara mayoría de ciudadanos expresando confianza y apoyo hacia la idea, parece que la aceptación de que los robots asuman funciones defensivas ha alcanzado niveles significativamente altos. Encuestas recientes indican que un alto porcentaje de la población está a favor de esta medida, destacando una fuerte aceptación pública hacia la integración de la tecnología en el ámbito de la defensa.",
    media:
      "A medida que la discusión sobre la posibilidad de que los robots asuman roles defensivos avanza, las opiniones de los ciudadanos parecen estar divididas. Si bien hay un segmento de la población que muestra cierta disposición hacia la idea, aproximadamente la mitad de los encuestados muestran reservas o preocupaciones respecto a la implementación de esta medida. Esto sugiere que, aunque existe cierto nivel de apoyo, aún queda un camino por recorrer para convencer a una parte significativa de la población.",
    baja: "Las perspectivas de que los ciudadanos aprueben la idea de que los robots tomen un papel activo en la defensa parecen ser escasas. Encuestas recientes muestran una falta generalizada de confianza y aceptación hacia esta propuesta, con menos del 20% de los encuestados expresando una disposición favorable. La mayoría de la población parece ser reacia a la idea, citando preocupaciones sobre la seguridad, la ética y el impacto social como principales razones detrás de su desaprobación",
  };
  const animation = {
    show: "scale-up-center",
    hide: "scale-out-center",
  };

  // capturo formulario
  const form = document.getElementById("form");
  const selectTec = form.querySelector("#selectTec");
  const selectRec = form.querySelector("#selectRec");
  const selectCon = form.querySelector("#selectCon");

  // llenamos listas

  arrayOp.forEach((item) => {
    selectTec.innerHTML += `<option value="${item}">${item}</option>`;
    selectRec.innerHTML += `<option value="${item}">${item}</option>`;
    selectCon.innerHTML += `<option value="${item}">${item}</option>`;
  });

  const URLAPI =
    "https://backfisrobots-9d1af2756d4d.herokuapp.com/calcular_posibilidad";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (
      selectTec.value.length == 0 ||
      selectRec.value.length == 0 ||
      selectCon.value.length == 0
    ) {
      Toastify({
        text: "No dejes ningún campo vacío",
        duration: 3000,
      }).showToast();
    } else {
      // armamos el objeto de la probabilidad
      const probabilidad = {
        tecnologia: Number(selectTec.value),
        inversion: Number(selectRec.value),
        aceptacion: Number(selectCon.value),
      };
      // mandamos la respuesta
      const { data } = await axios.post(URLAPI, probabilidad);
      console.log(data.posibilidad);
      // proceso para obtener el gif
      const urlGif = await obtainGif(data.posibilidad);
      console.log(urlGif);
      showModal(true);
    }
  });

  function showModal(op) {
    const secModal = document.getElementById("secModal");
    if (op) {
      secModal.classList.remove("hidden");
      secModal.classList.add(animation.show);
    } else {
      secModal.remove(animation.show);
      secModal.classList.add(animation.hide);
      setTimeout(() => {
        secModal.classList.remove(animation.hide);
        secModal.classList.add("hidden");
      }, 500);
    }
  }

  async function obtainGif(numero) {
    const apiKey = "V5FH60uLQRiD2xjxnNYDLI3YoWDbjIqA";

    function elegirTemaSegunNumero(num) {
      if (num < 50) {
        return "sad robot";
      } else if (num >= 50 && num < 70) {
        return "medium happy robot";
      } else {
        return "happy robot";
      }
    }

    const tema = elegirTemaSegunNumero(numero);
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${tema}&limit=50`;

    try {
      const response = await axios.get(url);
      const gifs = response.data.data; // Accede a los datos de la respuesta correctamente
      if (gifs.length > 0) {
        const indiceAleatorio = Math.floor(Math.random() * gifs.length);
        const urlGif = gifs[indiceAleatorio].images.original.url;
        return urlGif;
      } else {
        throw new Error("No se encontraron gifs");
      }
    } catch (error) {
      console.error("Error al obtener el GIF:", error);
      return null;
    }
  }
})();
