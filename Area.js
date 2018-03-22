//Josephine Nyoike and Ann Mudanye
let houses;
//loads data from the json into the local server and webpage
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
//contains all other functions and creates all other
function initialize() {
  let category = document.querySelector('#category');
  let searchTerm = document.querySelector('#searchTerm');
  let searchBtn = document.querySelector('button');
  let main = document.querySelector('main');

  
  let lastCategory = category.value;
  let lastSearch = searchTerm.value;

  
  let categoryGroup;
  let finalGroup;

  //set the finalGroup as the whole list of houses so we display all the houses initially
  finalGroup = houses;
  updateDisplay();

  
  categoryGroup = [];
  finalGroup = [];

  
  searchBtn.onclick = selectCategory;
  //select the category that we would like filter with.
  function selectCategory(e) {
    
    e.preventDefault();

    //clear out previous search
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
        for(let i = 0; i < houses.length ; i++) {
          
          if(houses[i].area === category.value) {
            categoryGroup.push(houses[i]);
          }
        }

        
        selectHouses();
      }
    }
  }

  //this functions filters the houses using the search terms that are entered in the search bar.
  function selectHouses() {
    
    if(searchTerm.value === '') {
      finalGroup = categoryGroup;
      updateDisplay();
    } else {
      
      for(let i = 0; i < categoryGroup.length ; i++) {
        if(categoryGroup[i].name.indexOf(searchTerm.value) !== -1) {
          finalGroup.push(categoryGroup[i]);
        }
      }

      
      updateDisplay();
    }

  }

  //update the display with the new set of houses
  function updateDisplay() {
    
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }

    //print a message when there are no elements to display
    if(finalGroup.length === 0) {
      let para = document.createElement('p');
      para.textContent = 'No results to display!';
      main.appendChild(para);
    
    } else {
      //pass each house to fetchBlob to fetch its image
      for(let i = 0; i < finalGroup.length; i++) {
        fetchBlob(finalGroup[i]);
      }
    }
  }

  //retrieves image for each house and sends its url to the showhouse method to be displayed
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

  //displays every house and its information
  function showhouse(objectURL, house) {
    
    let section = document.createElement('section');
    let heading = document.createElement('h2');
    let para1 = document.createElement('p');
    let para2 = document.createElement('p');
    let para3 = document.createElement('p');
    let para4 = document.createElement('p');
    let para5 = document.createElement('p');
    let para6 = document.createElement('p');
    let para7 = document.createElement('p');
    let para8 = document.createElement('p');
    let image = document.createElement('img');

    //set the class name of the sections. 
    section.setAttribute('class', house.area);

    //set heading to be the name of each house.
    heading.textContent = house.name.replace(house.name.charAt(0), house.name.charAt(0).toUpperCase());

    //adds these contents to the <p> tag of the html.
    para1.textContent = "year_built: " + house.year_built;
    para2.textContent = "year_renovated: " + house.year_renovated;
    para3.textContent =  "capacity: " + house.capacity;
    para4.textContent =  "# singles: " + house.singles;
    para5.textContent =  "# doubles: " + house.doubles;
    para6.textContent = "num_sharing_bathrm: " + house.num_sharing_bathrm;
    para7.textContent = "elevator: " + house.elevator+'\n';
    para8.textContent = "area: " + house.area;
    




    //sets the src and the alt elements of the img tag to the objectURL and the house name respectively.
    image.src = objectURL;
    image.alt = house.name;

    //append elements to the DOM
    main.appendChild(section);
    section.appendChild(heading);
    section.appendChild(image);
    section.appendChild(para8);
    section.appendChild(para1);
    section.appendChild(para2);
    section.appendChild(para3);
    section.appendChild(para4);
    section.appendChild(para5);
    section.appendChild(para6);
    section.appendChild(para7);
    
  }
}