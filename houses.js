let houses;
fetch('houses.json').then(function(response) {
  if(response.ok) {
    response.json().then(function(json) {
      houses = json;
      initialize();
    });
  } else {
    console.log('Network request for houses.json failed with response ' + response.status + ': ' + response.statusText);
  }
});

function initialize() {
  let category = document.querySelector('#category');
  let searchTerm = document.querySelector('#searchTerm');
  let searchBtn = document.querySelector('button');
  let main = document.querySelector('main');

  
  let lastCategory = category.value;
  let lastSearch = searchTerm.value;

  
  let categoryGroup;
  let finalGroup;

  
  finalGroup = houses;
  updateDisplay();

  
  categoryGroup = [];
  finalGroup = [];

  
  searchBtn.onclick = selectCategory;

  function selectCategory(e) {
    
    e.preventDefault();

    
    categoryGroup = [];
    finalGroup = [];

    
    if(category.value === lastCategory && searchTerm.value === lastSearch) {
      return;
    } else {
      
      lastCategory = category.value;
      lastSearch = searchTerm.value;
      
      if(category.value === 'All') {
        categoryGroup = houses;
        selectHouses();
      
      } else {
        
        let lowerCaseType = category.value.toLowerCase();
        for(let i = 0; i < houses.length ; i++) {
          
          if(houses[i].type === lowerCaseType) {
            categoryGroup.push(houses[i]);
          }
        }

        
        selectHouses();
      }
    }
  }

  
  function selectHouses() {
    
    if(searchTerm.value === '') {
      finalGroup = categoryGroup;
      updateDisplay();
    } else {
      
      let lowerCaseSearchTerm = searchTerm.value.toLowerCase();
      
      for(let i = 0; i < categoryGroup.length ; i++) {
        if(categoryGroup[i].name.indexOf(lowerCaseSearchTerm) !== -1) {
          finalGroup.push(categoryGroup[i]);
        }
      }

      
      updateDisplay();
    }

  }

  
  function updateDisplay() {
    
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }

    
    if(finalGroup.length === 0) {
      let para = document.createElement('p');
      para.textContent = 'No results to display!';
      main.appendChild(para);
    
    } else {
      for(let i = 0; i < finalGroup.length; i++) {
        fetchBlob(finalGroup[i]);
      }
    }
  }

  
  function fetchBlob(house) {
    
    let url = 'images/' + house.image;
    
    fetch(url).then(function(response) {
      if(response.ok) {
        response.blob().then(function(blob) {
          
          objectURL = URL.createObjectURL(blob);
          
          showhouse(objectURL, house);
        });
      } else {
        console.log('Network request for "' + house.name + '" image failed with response ' + response.status + ': ' + response.statusText);
      }
    });
  }

  
  function showhouse(objectURL, house) {
    
    let section = document.createElement('section');
    let heading = document.createElement('h2');
    let para = document.createElement('p');
    let image = document.createElement('img');

    
    section.setAttribute('class', house.area);

    
    heading.textContent = house.name.replace(house.name.charAt(0), house.name.charAt(0).toUpperCase());

    
    para.textContent = "year_built: " + house.year_built;
    para.textContent = "year_renovated: " + house.year_renovated;
    para.textContent = "capacity: " + house.capacity;
    para.textContent = "singles: " + house.singles;
    para.textContent = "doubles: " + house.doubles;
    para.textContent = "num_sharing_bathrm: " + house.num_sharing_bathrm;
    para.textContent = "elevator: " + house.elevator;




    
    image.src = objectURL;
    image.alt = house.name;

    
    main.appendChild(section);
    section.appendChild(heading);
    section.appendChild(para);
    section.appendChild(image);
  }
}