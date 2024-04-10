(function () {
  const arrayOp = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const defaultUrl =
    "https://www.honda-robots.com/wp-content/uploads/2018/06/J50-1.gif";
  const probtext = {
    alta: "La mayoría de la población muestra confianza y apoyo a que los robots asuman roles defensivos, reflejando una fuerte aceptación de la tecnología en la defensa según encuestas recientes.",
    media:
      "La opinión pública sobre el uso de robots en roles defensivos está dividida, con cerca de la mitad de los encuestados expresando reservas, indicando un apoyo limitado y la necesidad de más convencimiento.",
    baja: "Recientes encuestas indican una escasa aprobación ciudadana hacia la idea de robots en roles defensivos, debido a preocupaciones sobre seguridad, ética e impacto social.",
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
  const secLoader = document.getElementById("secLoader");
  const secInfoModal = document.getElementById("secInfoModal");

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
      //mostamos modal
      showModal(true);
      secInfoModal.classList.add("hidden");
      secLoader.classList.remove("hidden");

      const probabilidad = {
        tecnologia: Number(selectTec.value),
        inversion: Number(selectRec.value),
        aceptacion: Number(selectCon.value),
      };
      // mandamos la respuesta
      const { data } = await axios.post(URLAPI, probabilidad);
      console.log(data.posibilidad);
      // proceso para obtener el gif
      const urlGif = await obtainGif(Math.trunc(data.posibilidad));
      secLoader.classList.add("hidden");
      paintModal(Math.trunc(data.posibilidad), urlGif);
      secInfoModal.classList.remove("hidden");
      closeModal();
    }
  });

  function showModal(op) {
    const secModal = document.getElementById("secModal");
    if (op) {
      secModal.classList.remove("hidden");
      secModal.classList.add(animation.show);
    } else {
      secModal.classList.remove(animation.show);
      secModal.classList.add(animation.hide);
      setTimeout(() => {
        secModal.classList.remove(animation.hide);
        secModal.classList.add("hidden");
      }, 500);
    }
  }

  function paintModal(numero, url) {
    secInfoModal.querySelector("#imgModal").src = url;
    if (numero < 50) {
      secInfoModal.querySelector("#parrafo").textContent = probtext.baja;
    } else if (numero >= 50 && numero < 70) {
      secInfoModal.querySelector("#parrafo").textContent = probtext.media;
    } else {
      secInfoModal.querySelector("#parrafo").textContent = probtext.alta;
    }
    secInfoModal.querySelector("#spanProb").textContent = numero + "%";
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
        return defaultUrl;
      }
    } catch (error) {
      console.error("Error al obtener el GIF:", error);
      return null;
    }
  }

  function closeModal() {
    const btnClose = document.getElementById("btnClose");
    btnClose.addEventListener("click", () => {
      form.reset();
      showModal(false);
    });
  }
})();
