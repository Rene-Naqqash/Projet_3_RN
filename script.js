 // ******** Mon script ********

let gallery = document.querySelector('.gallery');
let works;
let categories;
let filters = document.getElementById('filters');

//  je fais appel à l'api avec "fetch"
function getWorks() {
  fetch('http://localhost:5678/api/works')
    .then((response) => response.json())   // cette ligne prend/récupérer les données qu'on a demandé au serveur et elle les stock dans (response) puis avec la fonction fléchée elle convertit les données en format JSON avec la méthode .json()

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
  console.log(data);
  data.forEach((category) => {
    console.log(category);
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
  let aTag = document.querySelectorAll("#filters a")
  aTag.forEach((a) => {
    a.addEventListener('click', function(event){
      aTag.forEach((a) =>{
        a.classList.remove("active");
      });
      event.currentTarget.classList.add('active');
      console.log(event);
    });
  });
}

function main() {
  let token = localStorage.getItem('token');
  if (token) {
    console.log('Utilisateur Connecté');
    getWorks();
  } else {
    getWorks();
    getCategories();
  }
}
main();
