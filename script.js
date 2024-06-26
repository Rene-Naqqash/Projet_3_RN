/** @format */

// ******** Mon script ********
let gallery = document.querySelector('.gallery');
let works;
let categories;
let newWorks;
let filters = document.querySelector('#filters');

//  je fais appel à l'api avec "fetch"
function getWorks() {
  fetch('http://localhost:5678/api/works')
    .then((response) => response.json())
    .then((data) => {
      works = data;
      insertWork(works);
      getCategories();
    })
    .catch(() => {
      console.log('Erreur de connexion');
    });
}

// dans notre fonction insertWork() elle prend comme paramètre les données qu'on lui a envoyé en format JSON depuis le fetch
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
    newFigure.setAttribute('id', `work-${work.id}`);
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
      let token = localStorage.getItem('token');
      if (token) {
        loggedIn();
      } else {
        insertCategories(categories);
      }
    })
    .catch(() => {
      console.log('error');
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
    new_a.addEventListener('click', function () {
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
    '<a href="#modal" title="éditer" class="js-modal"><i class="fa-regular fa-pen-to-square"></i></a> <a href="#modal" class="js-modal">Mode édition</a>';
  document.body.insertBefore(newEditSection, document.body.firstChild);

  // je rajoute une margin-top à mon header qui contient le titre et le nav-bar
  document.querySelector('header').classList.add('header-top-margin');

  //  ici je creer le bouton de modifier à côté de 'Mes Projet'
  let divModifier = document.querySelector('.edit-container');
  let divRightChildren = document.createElement('div');
  divRightChildren.classList.add('right-children');
  divRightChildren.innerHTML =
    ' <a href="#modal" class="second-child js-modal"> <i class="fa-regular fa-pen-to-square"></i></a> <a href="#modal" class="third-child js-modal">modifier</a>';
  divModifier.appendChild(divRightChildren);

  // target login <li> et changer son text
  let liLogin = document.querySelector('#a-login-logout');
  liLogin.innerText = 'logout';

  let loginLink = document.querySelector('#a-login-logout');
  loginLink.href = '#';
  // pour le logout
  liLogin.addEventListener('click', function () {
    logout();
  });

  // Executer la fonction openModal
  openModal();
  worksModal(works);
}

function openModal() {
  let modal = null;
  let linksModal = document.querySelectorAll('.js-modal');
  linksModal.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      let target = document.querySelector(e.target.getAttribute('href'));
      if (target != null) {
        target.style.display = null;
        target.removeAttribute('aria-hidden');
        target.setAttribute('aria-modal', 'true');
      } else {
        target = document.querySelector(e.target.parentElement.hash);
        target.style.display = null;
        target.removeAttribute('aria-hidden');
        target.setAttribute('aria-modal', 'true');
      }
      modal = target;
      modal.addEventListener('click', closeModal);
      modal
        .querySelector('.js-modal-btn-close')
        .addEventListener('click', closeModal);
      modal
        .querySelector('.js-modal-stop')
        .addEventListener('click', stopPropagation);
    });
  });

  // j'ajoute un ecouteur d'evenement à mon btn "Ajouter une Photo"
  let addPhotoButton = document.querySelector('#btn-add');
  addPhotoButton.addEventListener('click', modalAddPhoto);

  function closeModal(e) {
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
    // reinitialiser l'element de mon message erreur
    let errorMessage = document.querySelector('.error-message-modal');
    // j'ai mis un if car si je ferme la modal sur l'etap "ajout photo" et bien il y a un petit probleme car la div "gallery-modla" n'est pas dans le html et donc le errorMessage est automatiquement null et donc si je veux changer le style de mon errorMessage qui est NULL et bien le script il s'arrete car il y a une erreur. donc voila pourquoi j'ai mis un if
    if (errorMessage != null) {
      errorMessage.style.visibility = 'hidden';
    }
    returnModalGallery();
  }

  // pour bloquer la propagation qui vient de l'element parent qui est le aside "modal"
  function stopPropagation(e) {
    e.stopPropagation();
  }
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeModal(e);
    }
  });
}

// la fonction pour ajouter des travaux par l'admin
function modalAddPhoto() {
  // afficher la fleche de retour
  let backArrow = document.querySelector('#btn-return-modal');
  backArrow.style.visibility = 'visible';
  backArrow.addEventListener('click', returnModalGallery);
  // effacer mon innerHTML de ma div parent de gallery-modal
  let parentGalleryModal = document.querySelector('.modal-div-flex');
  parentGalleryModal.innerHTML = '';
  parentGalleryModal.innerHTML = `<p class="title-modal">Ajout photo</p> <form class="form" id="form"><div class="div-add-photo"> <div id="div-preview"> </div> <div class="toRemove"> <i class="fa-regular fa-image fa-5x"></i> <button id="btnAjouterPhoto"> + Ajouter photo </button> <p>jpg, png : 4mo max</p></div> <input  id="file" type="file"  style="display: none;"> </div> 
    <div class="inputDiv">
    <p class="titleP">Titre</p>
    <input type="text" id="title-work" name="title" size="10" />
    <p class="categoryP">Catégorie</p>
    <select name="category" id="category-selection">
      <option value="0" >--Sélectionnez une Catégorie--</option>
     </select> <p id="pEmpty"></p> <p id="error-message-add-photo" class="color-error" style="visibility: hidden">Erreur d'ajout</p> <button type="submit" id="btn-valider">Valider</button> </div> </form> `;
  let chooseCategoryParent = document.querySelector('#category-selection');
  let fileInput = document.querySelector('#file');
  // cette function affiche l'option des category dynamiquement dans la modal d'ajout photo
  selectCategory();
  //  pour ajouter une img
  let btnAjouter = document.querySelector('#btnAjouterPhoto');
  btnAjouter.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('#file').click();
  });
  fileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    let maxSize = 4194304;
    // pour vérifie la taille du fichier et si le type est bien en png ou en jpeg
    if (
      file &&
      (file.size > maxSize ||
        !(file.type === 'image/png' || file.type === 'image/jpeg'))
    ) {
      displayMessageError(
        '#error-message-add-photo',
        'Veuillez choisir une image (jpg, png) qui ne dépasse pas 4 Mo.'
      );
      return;
    } else {
      hideMessageError('#error-message-add-photo');
    }
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      const reader = new FileReader();
      reader.onload = function (e) {
        let divPreview = document.querySelector('#div-preview');
        let img = document.createElement('img');
        img.setAttribute('id', 'file-preview');
        img.setAttribute('alt', "Aperçu de l'image");
        img.src = e.target.result;
        divPreview.innerHTML = '';
        divPreview.appendChild(img);
        let toRemove = document.querySelector('.toRemove');
        if (toRemove) {
          toRemove.remove();
        }
      };
      reader.readAsDataURL(file);
    }
  });
  submittingFiles();
  messagesGestionAddPhotoModal();
}
function selectCategory() {
  categories.forEach((category) => {
    optionSelect(category.id, category.name);
  });
}
// function pour creer chaque option pour la balise select
function optionSelect(categoryId, categoryName) {
  let chooseCategoryParent = document.querySelector('#category-selection');
  let optionElement = document.createElement('option');
  optionElement.value = categoryId;
  optionElement.setAttribute('name', `option-${categoryId}`);
  optionElement.textContent = categoryName;
  chooseCategoryParent.appendChild(optionElement);
}

function submittingFiles() {
  let fileInput = document.querySelector('#file');
  let chooseCategoryParent = document.querySelector('#category-selection');
  let formSubmit = document.querySelector('#form');
  formSubmit.addEventListener('submit', handleForm);
  function handleForm(e) {
    e.preventDefault();

    let categoryValue = chooseCategoryParent.value;
    let categoryValueInt = parseInt(chooseCategoryParent.value);
    let titleValue = document.querySelector('#title-work').value.trim();
    let file = fileInput.files[0];

    let categoryName = document.querySelector('#category-selection')
      .selectedOptions[0].textContent;

    // Vérifier si les conditions sont remplies
    if (categoryValue === '0' || titleValue.trim() === '' || !file) {
      displayMessageError(
        '#error-message-add-photo',
        'Veuillez remplir tous les champs correctement et ajouter une photo (png ou jpeg) 4Mo max.'
      );
      return;
    }
    let imageUrl = URL.createObjectURL(file);
    let myFormData = new FormData(formSubmit);
    myFormData.append('image', file);

    const token = localStorage.getItem('token');
    fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: myFormData,
    })
      .then((response) => {
        if (response.ok) {
          addWorkLocally(titleValue, imageUrl, categoryValueInt, categoryName);

          insertWork(works);

          findLatestFigure();

          document.querySelector('.js-modal-btn-close').click();
        } else {
          displayMessageError(
            '#error-message-add-photo',
            "une erreur d'ajout s'est produit."
          );
        }
      })
      .catch(() => {
        displayMessageError(
          '#error-message-add-photo',
          'nous rencontrons une erreur de connexion'
        );
      });
  }
}

function messagesGestionAddPhotoModal() {
  let submitButton = document.querySelector('#btn-valider');
  let fileInput = document.querySelector('#file');
  let chooseCategoryParent = document.querySelector('#category-selection');
  chooseCategoryParent.addEventListener('change', checkFormValidity);
  document
    .querySelector('#title-work')
    .addEventListener('input', checkFormValidity);
  fileInput.addEventListener('change', checkFormValidity);

  // fonction verif pour les couleur de mon btn
  function checkFormValidity() {
    let categoryValue = chooseCategoryParent.value;
    let titleValue = document.querySelector('#title-work').value;
    let file = fileInput.files[0];

    // si ces conditions son bons je vais pouvoir activer mon bouton submit
    let isValid = categoryValue !== '0' && titleValue.trim() !== '' && file;

    // pour changer la couleur de mon btn submit en vert si les conditions sont validé
    if (isValid) {
      submitButton.classList.add('active');
    } else {
      submitButton.classList.remove('active');
    }
  }
}

function returnModalGallery() {
  // cacher la fleche de retour
  let backArrow = document.querySelector('#btn-return-modal');
  backArrow.style.visibility = 'hidden';
  // recreation de mon innerHTML dans ma div parent
  let parentGalleryModal = document.querySelector('.modal-div-flex');
  // SI la div est vide je remplit la div
  if (parentGalleryModal && parentGalleryModal.innerHTML.trim() === '') {
    parentGalleryModal.innerHTML =
      '<p class="title-modal">Galerie photo</p><div class="gallery-modal"></div><p class="error-message-modal" style="visibility: hidden">Erreur suppression</p><button id="btn-add">Ajouter une photo</button>';

    worksModal(works);
  }
  // sinon si y a déjà autre choses dans ma div et bien je nettois la div et je vais ajouter mon html de la gallery après le nettoyage
  else {
    // je declare ma div "gallery-modal"
    let galleryModal = document.querySelector('.gallery-modal');
    // si la div gallery-modal est presente ET elle est vide
    if (galleryModal && galleryModal.innerHTML.trim() === '') {
      worksModal(works);
    }
    // sinon je la vide et je la remplis du html voulu
    else {
      parentGalleryModal.innerHTML = '';
      parentGalleryModal.innerHTML =
        '<p class="title-modal">Galerie photo</p><div class="gallery-modal"></div><p class="error-message-modal" style="visibility: hidden">Erreur suppression</p><button id="btn-add">Ajouter une photo</button>';

      worksModal(works);
    }
  }
  // j'ajoute un ecouteur d'evenement à mon btn "Ajouter une Photo"
  let addPhotoButton = document.querySelector('#btn-add');
  addPhotoButton.addEventListener('click', modalAddPhoto);
}

// fonction pour trouver le tableau le plus recent et l'afficher sur l'ecran
function findLatestFigure() {
  const figures = document.querySelectorAll('.gallery figure');
  let largestId = 0;
  figures.forEach((figure) => {
    const id = parseInt(figure.getAttribute('id').split('-')[1]);
    if (id > largestId) {
      largestId = id;
    }
  });

  document
    .querySelector(`#work-${largestId.toString()}`)
    .scrollIntoView({ behavior: 'smooth' });
}

// pour trouver le dernier id des traveuax.
function lastIdWorks(works) {
  let lastId = 0;
  works.forEach((work) => {
    let id = work.id;
    if (id > lastId) {
      lastId = id;
    }
  });
  return lastId;
}

// fonction pour ajouter le newWork dans le tableau works
function addWorkLocally(title, imageUrl, categoryId, categoryName) {
  // Je rajoute le nouvel objet dans mon tableau works
  works.push({
    id: lastIdWorks(works) + 1, // Pour ajouter un Id Unique et plus grand que les autres id déjà existants
    title: title,
    categoryId: categoryId,
    imageUrl: imageUrl,
    userId: 1,
    category: {
      id: categoryId,
      name: categoryName,
    },
  });
}

/*
// fonction pour generer les travaux dans la modal
*/
function worksModal(worksArr) {
  let displayWorksModal = document.querySelector('.gallery-modal');
  //console.log(worksArr); //!!!
  worksArr.forEach((work) => {
    // creation des elements html
    let newdiv = document.createElement('div');
    let addImage = document.createElement('img');
    let trashIcon = document.createElement('i');
    // affectation de valeurs pour les elements créé
    newdiv.setAttribute('category', work.category.name);
    newdiv.setAttribute('work', work.id);
    newdiv.classList.add('img-div');
    addImage.src = work.imageUrl;
    trashIcon.classList.add('fa-solid', 'fa-trash-can', 'fa-sm');
    // on ajoute l'image  notre balise div
    newdiv.appendChild(addImage);
    newdiv.appendChild(trashIcon);
    // puis on ajoute notre div dans notre displayWorksModal
    displayWorksModal.appendChild(newdiv);

    trashIcon.addEventListener('click', function (e) {
      let itemToDelete = e.target.parentElement.attributes[1].value;
      //console.log(itemToDelete); //!!!
      deleteWorks(itemToDelete);
    });
  });
}
//
function reInsertWorksModal() {
  let displayWorksModal = document.querySelector('.gallery-modal');
  displayWorksModal.innerHTML = '';
  worksModal(works);
}

// la fonction qui est responsable de supprimer les travaux
function deleteWorks(workNumber) {
  const token = localStorage.getItem('token');

  fetch(`http://localhost:5678/api/works/${workNumber}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      // console.log(response.status); //!!!
      if (response.ok) {
        works = works.filter((work) => work.id !== parseInt(workNumber));
        reInsertWorksModal();
        insertWork(works);
      } else {
        let errorMessage = document.querySelector('.error-message-modal');
        errorMessage.innerText = 'Erreur de suppression';
        errorMessage.style.visibility = 'visible';
      }
    })
    .catch(() => {
      let errorMessage = document.querySelector('.error-message-modal');
      errorMessage.innerText = 'Erreur de suppression Network';
      errorMessage.style.visibility = 'visible';
    });
}

// la fonction de logout qui supprime le token etc
function logout() {
  let loginLogout = document.querySelector('#a-login-logout');
  if (loginLogout.innerText === 'logout') {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  }
}

// pour afficher le message d'erreur
function displayMessageError(querySelector, message) {
  let myElement = document.querySelector(querySelector);
  myElement.innerHTML = message;
  myElement.style.visibility = 'visible';
}
// pour cacher le message d'erreur
function hideMessageError(querySelector) {
  let myElement = document.querySelector(querySelector);
  myElement.innerHTML = '';
  myElement.style.visibility = 'hidden';
}

function main() {
  getWorks();
}
main();
