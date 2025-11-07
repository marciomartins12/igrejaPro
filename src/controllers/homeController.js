function toWebpPath(p) {
  if (!p) return p;
  return p.replace(/\.(png|jpg|jpeg)$/i, '.webp');
}

exports.index = (req, res) => {
  const retreatTitle = '/img/Retiro%20Alfa%20e%20Omega%20titulo.png';
  const retreatCards = [
    { src: '/img/papa.PNG', alt: 'Sacerdote' },
    { src: '/img/menina%20dedo%20nariz.PNG', alt: 'Jovem tampando ouvidos' },
    { src: '/img/carinhaSorrindo.png.PNG', alt: 'carinha sorrindo ' },
    { src: '/img/menina%20flor%20.PNG', alt: 'Jovem com flores' },
    { src: '/img/velhinha%20freira.PNG', alt: 'Freira' },
    { src: '/img/carinha%20com%20o%20cajado.PNG', alt: 'Jovem com cajado' },
  ].map(i => ({ ...i, webpSrc: toWebpPath(i.src) }));

  res.render('home', {
    layout: 'landing',
    churchName: process.env.CHURCH_NAME || 'Nome da Igreja',
    year: new Date().getFullYear(),
    retreat: {
      titleImage: retreatTitle,
      titleImageWebp: toWebpPath(retreatTitle),
      cards: retreatCards,
      logo: '/img/Logoazul.png',
      logoWebp: toWebpPath('/img/Logoazul.png'),
      description:
        '<strong>Há 28 anos</strong>, o <strong>Retiro Alfa e Ômega</strong> é um <strong>movimento católico</strong> que transforma vidas por meio da força do Espírito Santo. Desde sua fundação, tem sido um espaço de encontro profundo com <strong>Deus</strong>, onde gerações de <strong>jovens têm sido evangelizadas, curadas e renovadas na fé</strong>. Em 2026, o movimento celebra 28 anos de missão, mantendo viva a chama do amor de Cristo e o desejo de formar jovens cheios do Espírito Santo, prontos para testemunhar o <strong>Evangelho com alegria e coragem</strong>.',
    },
    poster: {
      title: 'Cartaz 2026',
      image: '/img/Cartaz2026.jpg',
      imageWebp: toWebpPath('/img/Cartaz2026.jpg'),
      bullets: [
        { text: '<strong>Estilo de quadrinhos:</strong> representa dinamismo, juventude e protagonismo, cada pessoa é o herói da própria história com Deus.' },
        { text: '<strong>Personagens (santos e figuras inspiradoras):</strong> simbolizam as diferentes formas de viver a vocação, no amor, no serviço, na alegria, na entrega e na criatividade.' },
        { text: '<strong>Símbolos e adesivos (nuvem, câmera, gestos de paz):</strong> aproximam o sagrado do cotidiano moderno, tornando a mensagem mais acessível e conectada ao público jovem.' },
        { text: '<strong>Cores (ainda que o cartaz esteja em preto e branco):</strong> sugerem o contraste entre o humano e o divino, entre a luz e a transformação. Ao longo da semana do retiro, essas cores ganharão vida por meio de postagens em quadrinhos coloridos, apresentando cada um dos santos retratados e um pouco de sua história inspiradora.' },
      ],
    },
    gallery: {
      url: process.env.GALLERY_URL || '/galeria',
      images: [
        { src: '/img/cruz.JPG', alt: 'Ostensório em meio às flores' },
        { src: '/img/carinha%20derramando%20agua.png', alt: 'Brincadeira com água no retiro' },
        { src: '/img/menino%20ajoelhado%20apotando%20a%20mao.png', alt: 'Momento de oração' },
      ].map(i => ({ ...i, webpSrc: toWebpPath(i.src) })),
    },
  });
};

exports.galleryPage = (req, res) => {
  res.render('gallery', {
    layout: 'landing',
    churchName: process.env.CHURCH_NAME || 'Nome da Igreja',
    year: new Date().getFullYear(),
    gallery: {
      title: 'Galeria Alfa&Ômega',
      url: process.env.GALLERY_URL || '/',
      images: [
        { src: '/img/cruz.JPG', alt: 'Ostensório em meio às flores' },
        { src: '/img/carinha%20derramando%20agua.png', alt: 'Brincadeira com água no retiro' },
        { src: '/img/menino%20ajoelhado%20apotando%20a%20mao.png', alt: 'Momento de oração' },
      ].map(i => ({ ...i, webpSrc: toWebpPath(i.src) })),
    },
  });
};