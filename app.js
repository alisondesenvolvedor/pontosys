document.addEventListener("DOMContentLoaded", function () {
  const cameraSection = document.getElementById("cameraSection");
  const cameraPreview = document.getElementById("cameraPreview");
  const closeCameraButton = document.getElementById("closeCameraButton");
  const pontoSection = document.getElementById("pontoSection");

  // Função para abrir a câmera
  function openCamera() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        cameraPreview.srcObject = stream;
        cameraPreview.play();
        cameraSection.style.display = "block";
        pontoSection.style.display = "none";
      })
      .catch(function (err) {
        console.error("Erro ao acessar a câmera: " + err);
      });
  }

  // Event listener para o botão "Fechar Câmera"
  closeCameraButton.addEventListener("click", function () {
    const stream = cameraPreview.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      cameraPreview.srcObject = null;
      cameraSection.style.display = "none";
      pontoSection.style.display = "block";
    }
  });

  // Event listener para o botão "Bater o Ponto"
  // Adicione aqui a lógica para bater o ponto quando a câmera estiver ativa

  // Event listener para iniciar a câmera ao carregar a página
  openCamera();
});