// ******** Mon script ********

let gallery = document.querySelector('.gallery');
let works;
let categories;
let filters = document.getElementById('filters');

//  je fais appel à l'api avec "fetch"
function getWorks() {
  fetch('http://localhost:5678/api/works')
    .then((response) => response.json()) // cette ligne prend/récupérer les données qu'on a demandé au serveur et elle les stock dans (response) puis avec la fonction fléchée elle convertit les données en format JSON avec la méthode .json()

    // ici une fois qu'on a résolu la première promesse qui a récupéré les données et les a convertis en JSON, et bien on va prendre les données JSON qu'on a appelé (data) et on va les mettre dans notre variable works. puis on va appeler notre fonction insertWork() et on va lui donnéer comme paramètre tout ce qu'on a récupéré et traiter (convertit en JSON) de la part du serveur et affecté à works donc ça donne insertWork(works)
    .then((data) => {
      works = data;
      insertWork(works);
    })
    // ici c'est une méthode des promesses qui est appelée lorsque la promesse est rejetée. Elle prend une fonction comme argument, qui est exécutée en cas d'erreur. donc si les promesses précédents n'ont pas été résolus donc ils ont été rejeté et bien on va afficher le type d'erreur dans la console
    .catch((error) => {
      console.log(error);
    });
}

// dans notre fonction insertWork() elle prend comme paramètre les données qu'on lui a envoyé en format JSON
function insertWork(data) {
  // ici on dit de vider le contenue de la classe gallery pour pouvoir ensuite afficher le contenue reçu de la part de notre serveur et puis l'afficher dynamiquement
  gallery.innerHTML = '';
  //
  data.forEach((work) => {
    // creation des element html
    let newFigure = document.createElement('figure');
    let addImage = document.createElement('img');
    let addFigureCaption = document.createElement('figcaption');
    // affectation de valeurs pour les elements créé
    newFigure.setAttribute('category', work.category.name);
    newFigure.setAttribute('work', work.id);
    addImage.src = work.imageUrl;
    addImage.alt = work.title;
    addFigureCaption.textContent = work.title;
    // on ajoute l'image et le titre dans notre balise figure
    newFigure.appendChild(addImage);
    newFigure.appendChild(addFigureCaption);
    // puis on ajoute notre figure dans notre gallery
    gallery.appendChild(newFigure);
  });
}

function getCategories() {
  fetch('http://localhost:5678/api/categories')
    .then((response) => response.json())
    .then((data) => {
      categories = data;

      insertCategories(categories);
    })
    .catch((error) => {
      console.log(error);
    });
}

function insertCategories(data) {
  filters.innerHTML = '';
  let a = document.createElement('a');
  a.classList.add('active');
  let h3 = document.createElement('h3');
  h3.id = 'tous';
  h3.innerText = 'Tous';
  a.appendChild(h3);
  a.addEventListener('click', function (e) {
    insertWork(works);
  });
  filters.appendChild(a);
  data.forEach((category) => {
    let new_a = document.createElement('a');
    let new_h3 = document.createElement('h3');
    new_h3.id = category.name;
    new_h3.innerText = category.name;
    new_a.appendChild(new_h3);
    new_a.addEventListener('click', function (e) {
      let categoryName = category.name;
      // j'utilise la methode filter pour faire le tri des categories
      let result = works.filter((work) => {
        return work.category.name === categoryName;
      });
      insertWork(result);
    });
    filters.appendChild(new_a);
  });
  // Color filtres
  let aTag = document.querySelectorAll('#filters a');
  aTag.forEach((a) => {
    a.addEventListener('click', function (event) {
      aTag.forEach((a) => {
        a.classList.remove('active');
      });
      event.currentTarget.classList.add('active');
    });
  });
}
function loggedIn() {
  // c'est pour creer la bar noir en haut de la page
  let newEditSection = document.createElement('section');
  newEditSection.classList.add('editSection');
  newEditSection.innerHTML =
    '<a href="#modal" class="js-modal"><i class="fa-regular fa-pen-to-square"></i></a> <a href="#modal" class="js-modal">Mode édition</a>';
  document.body.insertBefore(newEditSection, document.body.firstChild);

  //  ici je creer le bouton de modifier à côté de 'Mes Projet'
  let divModifier = document.querySelector('.edit-container');
  let divRightChildren = document.createElement('div');
  divRightChildren.classList.add('right-children');
  divRightChildren.innerHTML =
    ' <a href="#modal" class="second-child js-modal"> <i class="fa-regular fa-pen-to-square"></i></a> <a href="#modal" class="third-child js-modal">modifier</a>';
  divModifier.appendChild(divRightChildren);

  // Executer la fonction openModal
  openModal();

  // target login <li> et changer son text
  let liLogin = document.querySelector('#li-login');
  liLogin.innerText = 'logout';

  // je vais mettre le code pour target le a tag et changer son href pour logout ou je vais mettre un ecouteur d'evenements pour apres executer une foction de logout qui supprimera le token du stockage local. je pense que la deuxieme facon est la best pour ce cas.
  let loginLink = document.querySelector('#a-login-logout');
  loginLink.href = '#';
  // pour le logout
  liLogin.addEventListener('click', function () {
    logout();
  });
}

// la fonction qui permet d'ouvrir la modal
function openModal() {
  let modal = null;
  let linksModal = document.querySelectorAll('.js-modal');
  linksModal.forEach((link) => {
    link.addEventListener('click', function (e) {
      // console.log(e);
      e.preventDefault();
      let target = document.querySelector(e.target.getAttribute('href'));
      // console.log(target);
      if (target != null) {
        target.style.display = null;
        target.removeAttribute('aria-hidden');
        target.setAttribute('aria-modal', 'true');
      } else {
        target = document.querySelector(e.target.parentElement.hash);
        target.style.display = null;
        target.removeAttribute('aria-hidden');
        target.setAttribute('aria-modal', 'true');
        // console.log(target);
      }
      modal = target;
      // console.log(modal);
      modal.addEventListener('click', closeModal);
      modal
        .querySelector('.js-modal-btn-close')
        .addEventListener('click', closeModal);
      modal
        .querySelector('.js-modal-stop')
        .addEventListener('click', stopPropagation);
    });
  });

  const closeModal = function (e) {
    if (modal === null) return;
    e.preventDefault();
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal
      .querySelector('.js-modal-btn-close')
      .removeEventListener('click', closeModal);
    modal
      .querySelector('.js-modal-stop')
      .removeEventListener('click', stopPropagation);
    modal = null;
  };
  // pour bloquer la propagation qui vient de l'element parent qui est le aside "modal"
  const stopPropagation = function (e) {
    e.stopPropagation();
  };
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeModal(e);
    }
  });
}

function logout() {
  let loginLogout = document.querySelector('#li-login');
  if (loginLogout.innerText === 'logout') {
    localStorage.removeItem('token');
    window.location.href = '/Projet_3_RN/index.html';
  }
}

function main() {
  let token = localStorage.getItem('token');
  if (token) {
    console.log('Utilisateur Connecté');
    loggedIn();
    getWorks();
  } else {
    getWorks();
    getCategories();
  }
}
main();
