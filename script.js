document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("photoCanvas");
  const loginSection = document.getElementById("loginSection");
  const pontoSection = document.getElementById("pontoSection");
  const loginForm = document.getElementById("loginForm");
  const checkInButton = document.getElementById("checkInButton");
  const logoutButton = document.getElementById("logoutButton");
  const cameraPreview = document.getElementById("cameraPreview");
  const result = document.getElementById("result");

  let cameraStream = null;

  // Dados fictícios de usuários cadastrados (substitua por um banco de dados real)
  const users = [
    { username: "usuario1", password: "senha1" },
    { username: "usuario2", password: "senha2" }
  ];

  // Função para verificar se o usuário está cadastrado
  function isUserRegistered(username, password) {
    return users.some(user => user.username === username && user.password === password);
  }

  // Função para mostrar a seção de ponto após o login bem-sucedido
  function showPontoSection() {
    loginSection.style.display = "none";
    pontoSection.style.display = "block";
    activateCamera(); // Ativa a câmera quando a seção de ponto é exibida
  }

  // Event listener para o formulário de login
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Impede o envio do formulário

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (isUserRegistered(username, password)) {
      showPontoSection();
    } else {
      alert("Credenciais inválidas. Tente novamente.");
    }
  });

  // Event listener para o botão de logout
  logoutButton.addEventListener("click", function () {
    loginSection.style.display = "block";
    pontoSection.style.display = "none";
    deactivateCamera(); // Desliga a câmera ao fazer logout
  });

  // Função para ativar a câmera
  function activateCamera() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        cameraStream = stream;
        cameraPreview.srcObject = cameraStream;
        cameraPreview.play();
      })
      .catch(function (err) {
        console.error("Erro ao acessar a câmera: " + err);
      });
  }

  // Função para desligar a câmera
  function deactivateCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraPreview.srcObject = null;
    }
  }

  // Event listener para o botão de bater o ponto
  checkInButton.addEventListener("click", function () {
    checkLocation();
    takePhoto(); // Tira a foto automaticamente ao clicar em "Bater Ponto"
  });

  // Função para calcular a distância entre duas coordenadas geográficas (fórmula de Haversine)
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371000;

    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
  }

  function degToRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  function checkLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const companyLat = -22.41216;
        const companyLng = -51.53005;

        const distance = calculateDistance(userLat, userLng, companyLat, companyLng);

        const acceptableDistance = 900;

        if (distance <= acceptableDistance) {
          const currentDate = new Date();
          const formattedDate = formatDate(currentDate);
          const formattedTime = formatTime(currentDate);

          result.innerHTML = `Registrado com sucesso em ${formattedDate} às ${formattedTime}`;
        } else {
          result.innerHTML = "Você não está na empresa. Não é possível bater o ponto.";
        }
      });
    } else {
      result.innerHTML = "Geolocalização não suportada pelo seu navegador.";
    }
  }

  // Função para tirar a foto
  function takePhoto() {
    const context = canvas.getContext("2d");
    canvas.width = cameraPreview.videoWidth;
    canvas.height = cameraPreview.videoHeight;
    context.drawImage(cameraPreview, 0, 0, canvas.width, canvas.height);

    // Exibe a imagem capturada (você pode enviar essa imagem para um servidor ou fazer o que desejar)
    const imgData = canvas.toDataURL("image/png");
    const imgElement = new Image();
    imgElement.src = imgData;
    document.body.appendChild(imgElement);
  }

  function formatDate(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }
});

function validateUser() {
  // Substitua este exemplo pela lógica real de validação do usuário
  const storedUsername = localStorage.getItem("username");
  const storedPassword = localStorage.getItem("password");
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  return storedUsername === username && storedPassword === password;
}

const checkInButton = document.getElementById('checkInButton');
const successCheck = document.getElementById('successCheck');
const confirmButton = document.getElementById('confirmButton'); // Adicione esta linha para selecionar o botão de confirmação

checkInButton.addEventListener('click', () => {
  // Simule a validação do usuário (substitua esta linha pelo seu código real)
  const validationSuccessful = validateUser();

  if (validationSuccessful) {
    // Exibe a div do visto verde
    successCheck.style.display = 'flex';
  }
});

// Event listener para o botão de confirmar
confirmButton.addEventListener("click", function () {
  // Oculta a imagem e o botão de confirmação
  capturedImage.style.display = 'none';
  confirmButton.style.display = 'none';

  // Valide o usuário aqui
  const validationSuccessful = validateUser();

  if (validationSuccessful) {
    // Exibe o visto verde no centro da tela
    const successCheck = document.getElementById('successCheck');
    successCheck.style.display = 'block';
  }
});