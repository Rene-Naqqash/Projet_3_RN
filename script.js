// ******** Mon script test ********

let gallery = document.querySelector('.gallery');
let works;
let categories;
let filters = document.getElementById('filters');

//  je fais appel à l'api avec "fetch"
function getWorks() {
  fetch('http://localhost:5678/api/works')
    .then((response) => response.json())
    .then((data) => {
      works = data;

      insertWork(works);
    })
    .catch((error) => {
      console.log(error);
    });
}

function insertWork(data) {
  gallery.innerHTML = '';
  data.forEach((work) => {
    console.log(work);
    let newFigure = document.createElement('figure');
    let addImage = document.createElement('img');
    let addFigureCaption = document.createElement('figcaption');
    newFigure.setAttribute('category', work.category.name);
    newFigure.setAttribute('work', work.id);
    addImage.src = work.imageUrl;
    addImage.alt = work.title;
    addFigureCaption.textContent = work.title;

    newFigure.appendChild(addImage);
    newFigure.appendChild(addFigureCaption);

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
  let h3 = document.createElement('h3');
  h3.id = 'tous';
  h3.innerText = 'Tous';
  a.appendChild(h3);
  a.addEventListener('click', function () {
    insertWork(works);
  });
  filters.appendChild(a);
  data.forEach((category) => {
    console.log(category);
    let new_a = document.createElement('a');
    let new_h3 = document.createElement('h3');
    new_h3.id = category.name;
    new_h3.innerText = category.name;

    new_a.appendChild(new_h3);
    new_a.addEventListener('click', function (e) {
      console.log(e);

      let result = works.filter((work) => {
        // j'ai pas encore finis ::::::
        // e.target.nodeValue ==
      });
      insertWork(result);
    });
    filters.appendChild(new_a);
  });
}
getWorks();
getCategories();
