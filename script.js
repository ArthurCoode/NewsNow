// Chave de API (apenas para notícias)
const GNEWS_API_KEY = '31a6ebb6ae73f04f8f8e84fd752f1b81'; // Sua chave da GNews

// URL da API de notícias
const URL_NOTICIAS = `https://gnews.io/api/v4/top-headlines?category=general&lang=pt&country=br&max=3&apikey=${GNEWS_API_KEY}`;

// Tempo de cache (1 hora em milissegundos)
const CACHE_EXPIRY = 60 * 60 * 1000;

// Função para buscar notícias com cache
async function buscarNoticias() {
  const cacheKey = 'gnewsCache';
  const cachedData = localStorage.getItem(cacheKey);

  // Verifica se há dados em cache e se ainda estão válidos
  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_EXPIRY) {
      exibirNoticias(data.articles);
      return;
    }
  }

  // Busca novos dados da API
  try {
    const response = await fetch(URL_NOTICIAS);
    const data = await response.json();

    if (data.articles) {
      // Salva os dados no cache
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
      exibirNoticias(data.articles);
    } else {
      console.error('Erro ao buscar notícias:', data.message);
    }
  } catch (error) {
    console.error('Erro na requisição de notícias:', error);
  }
}

// Função para exibir notícias
function exibirNoticias(noticias) {
  const gridNoticias = document.querySelector('.grid-noticias');
  gridNoticias.innerHTML = '';

  noticias.forEach((noticia) => {
    const article = document.createElement('article');
    article.innerHTML = `
      <img src="${noticia.image || 'images/placeholder.jpg'}" alt="${noticia.title}">
      <div class="noticia-info">
        <h3>${noticia.title}</h3>
        <p>${noticia.description || 'Descrição não disponível.'}</p>
        <a href="${noticia.url}" target="_blank">Leia mais <i class="fas fa-arrow-right"></i></a>
      </div>
    `;
    gridNoticias.appendChild(article);
  });
}

// Função para exibir vídeos manualmente
function exibirVideosManualmente() {
  const gridVideos = document.querySelector('.grid-videos');
  gridVideos.innerHTML = '';

  // Lista de vídeos (substitua pelos IDs reais dos vídeos do YouTube)
  const videos = [
    { id: 'pvtA-P_js3U', title: 'Nikolas Ferreira comemora após governo Lula revogar mudanças no Pix: "Grande dia"' },
    { id: 'O7ENfnrg9Uk', title: 'Lula "ignorar" achados da PF sobre desvios no Dnocs é estratégia após erros, diz cientista política' },
    { id: 'zaE3inO8QH0', title: 'PALMEIRAS 2 X 3 GRÊMIO | GOLS | COPA SP DE FUTEBOL JR 2025' },
  ];

  videos.forEach((video) => {
    const article = document.createElement('article');
    article.innerHTML = `
      <iframe src="https://www.youtube.com/embed/${video.id}" frameborder="0" allowfullscreen></iframe>
      <h3>${video.title}</h3>
    `;
    gridVideos.appendChild(article);
  });
}

// Busca notícias ao carregar a página
buscarNoticias();

// Exibe vídeos manualmente ao carregar a página
exibirVideosManualmente();

// Dark Mode Toggle
document.getElementById('dark-mode-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  // Salvar preferência do usuário no localStorage
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
  } else {
    localStorage.setItem('darkMode', 'disabled');
  }
});

// Verificar preferência do usuário ao carregar a página
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
}

// Menu Mobile
document.querySelector('.menu-toggle').addEventListener('click', () => {
  document.querySelector('nav').classList.toggle('active');
});

// Botão "Voltar ao Topo"
window.addEventListener('scroll', () => {
  const btnTopo = document.getElementById('btn-topo');
  if (window.scrollY > 300) {
    btnTopo.classList.add('visible');
  } else {
    btnTopo.classList.remove('visible');
  }
});

document.getElementById('btn-topo').addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Carrossel
const slides = document.querySelector('.carrossel .slides');
const prevButton = document.querySelector('.carrossel-prev');
const nextButton = document.querySelector('.carrossel-next');
const totalSlides = document.querySelectorAll('.carrossel .slide').length;
let currentIndex = 0;

// Função para mover o carrossel
function moveCarrossel(direction) {
  if (direction === 'next') {
    currentIndex = (currentIndex + 1) % totalSlides;
  } else if (direction === 'prev') {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  }
  const offset = -currentIndex * 100;
  slides.style.transform = `translateX(${offset}%)`;
}

// Eventos dos botões
prevButton.addEventListener('click', () => moveCarrossel('prev'));
nextButton.addEventListener('click', () => moveCarrossel('next'));

// Autoplay (opcional)
let autoplayInterval;

function startAutoplay() {
  autoplayInterval = setInterval(() => moveCarrossel('next'), 5000); // Troca de slide a cada 5 segundos
}

function stopAutoplay() {
  clearInterval(autoplayInterval);
}

// Iniciar autoplay ao carregar a página
startAutoplay();

// Pausar autoplay ao interagir com o carrossel
slides.addEventListener('mouseenter', stopAutoplay);
slides.addEventListener('mouseleave', startAutoplay);