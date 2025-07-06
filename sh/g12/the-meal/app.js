// Function to render meals with image, title, and category
function renderMealResults(responses) {
  const container = document.getElementById("ingredients-container");
  container.innerHTML = "";

  if (!responses || responses.length === 0) {
    container.innerHTML = '<p class="no-results">No meals found. Try a different search.</p>';
    document.getElementById('meal-details-container').innerHTML = '';
    return;
  }

  responses.forEach((response) => {
    const mealContainer = document.createElement("div");
    mealContainer.classList.add("meal");

    const mealImage = document.createElement("img");
    mealImage.src = response.strMealThumb;
    mealImage.alt = response.strMeal;
    mealImage.classList.add("meal-image");

    const titleElement = document.createElement("a");
    titleElement.textContent = response.strMeal;
    titleElement.classList.add('title');
    titleElement.href = "#";
    titleElement.addEventListener('click', (event) => {
      event.preventDefault();
      fetchMealDetailsById(response.idMeal);
      scrollToDetails();
    });

    const categoryElement = document.createElement("p");
    categoryElement.textContent = response.strCategory || 'Unknown Category';

    mealContainer.appendChild(mealImage);
    mealContainer.appendChild(titleElement);
    mealContainer.appendChild(categoryElement);

    container.appendChild(mealContainer);
  });
}

// Function to fetch meal details including category
function fetchMealDetails(meals) {
  const mealPromises = meals.map(meal =>
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
      .then(response => response.json())
      .then(data => data.meals ? data.meals[0] : null)
  );

  return Promise.all(mealPromises);
}

// Function to reset other dropdowns
function resetOtherDropdowns(except) {
  const dropdowns = ['letterSelect', 'categorySelect', 'areaSelect'];
  dropdowns.forEach(id => {
    if (id !== except) {
      const dropdown = document.getElementById(id);
      dropdown.selectedIndex = 0;
    }
  });
}

// Add event listener for letter dropdown
document.getElementById('letterSelect').addEventListener('change', function () {
  const letter = this.value;
  resetOtherDropdowns('letterSelect');

  if (letter) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
      .then(response => response.json())
      .then(data => {
        if (data.meals) {
          renderMealResults(data.meals);
        } else {
          document.getElementById('ingredients-container').innerHTML = '<p class="no-results">No meals found</p>';
        }
      })
      .catch(() => {
        document.getElementById('ingredients-container').innerHTML = '<p class="no-results">Error fetching meals</p>';
      });
  }
});

// Add event listener for category dropdown
document.getElementById('categorySelect').addEventListener('change', function () {
  const category = this.value;
  resetOtherDropdowns('categorySelect');

  if (category) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
      .then(response => response.json())
      .then(data => {
        if (data.meals) {
          fetchMealDetails(data.meals)
            .then(detailedMeals => renderMealResults(detailedMeals));
        } else {
          document.getElementById('ingredients-container').innerHTML = '<p class="no-results">No meals found in this category</p>';
        }
      })
      .catch(() => {
        document.getElementById('ingredients-container').innerHTML = '<p class="no-results">Error fetching meals</p>';
      });
  }
});

// Add event listener for area dropdown
document.getElementById('areaSelect').addEventListener('change', function () {
  const area = this.value;
  resetOtherDropdowns('areaSelect');

  if (area) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area.charAt(0).toUpperCase() + area.slice(1)}`)
      .then(response => response.json())
      .then(data => {
        if (data.meals) {
          fetchMealDetails(data.meals)
            .then(detailedMeals => renderMealResults(detailedMeals));
        } else {
          document.getElementById('ingredients-container').innerHTML = '<p class="no-results">No meals found in this area</p>';
        }
      })
      .catch(() => {
        document.getElementById('ingredients-container').innerHTML = '<p class="no-results">Error fetching meals</p>';
      });
  }
});

// Function to search meals based on input value
function searchMeals() {
  const searchValue = document.getElementById('SearchName').value.trim();
  const container = document.getElementById('ingredients-container');
  const detailsContainer = document.getElementById('meal-details-container');
  
  // Reset details container when performing a new search
  detailsContainer.innerHTML = '';
  
  if (!searchValue) {
    container.innerHTML = '<p class="no-results">Please enter a meal name or ID</p>';
    return;
  }
  
  // Check if the input is a number (meal ID)
  if (!isNaN(searchValue)) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${searchValue}`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        if (data.meals) {
          renderMealResults(data.meals);
        } else {
          container.innerHTML = '<p class="no-results">No meals found</p>';
        }
      })
      .catch(error => {
        console.error('Error fetching meals by ID:', error);
        container.innerHTML = '<p class="no-results">Error fetching meal by ID. Please check the ID and try again.</p>';
      });
  } else {
    // Search by meal name
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`)
      .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
      })
      .then(data => {
        if (data.meals) {
          renderMealResults(data.meals);
        } else {
          container.innerHTML = '<p class="no-results">No meals found</p>';
        }
      })
      .catch(error => {
        console.error('Error fetching meals by name:', error);
        container.innerHTML = '<p class="no-results">Error fetching meals. Please try again later.</p>';
      });
  }
}

// Event listener for input in the search box
document.getElementById('SearchName').addEventListener('input', searchMeals);

// Function to scroll smoothly to the details container
function scrollToDetails() {
  const detailsContainer = document.getElementById('meal-details-container');
  detailsContainer.scrollIntoView({ behavior: 'smooth' });
}

// Function to fetch and render meal details
function fetchMealDetailsById(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(response => response.json())
    .then(data => {
      if (data.meals) {
        renderMealDetails(data.meals[0]);
      } else {
        document.getElementById('meal-details-container').innerHTML = '<p class="no-results">Meal not found.</p>';
      }
    })
    .catch(() => {
      document.getElementById('meal-details-container').innerHTML = '<p class="no-results">Error fetching meal details.</p>';
    });
}

// Function to render meal details in the container
function renderMealDetails(meal) {
  const container = document.getElementById('meal-details-container');
  
  // Create ingredients list with fallback for missing images
  const ingredientsList = getIngredientsList(meal).map((ingredient, index) => {
    const img = ingredient.imageUrl ? 
      `<img src="${ingredient.imageUrl}" alt="${ingredient.name}" class="ingredient-image" onerror="this.onerror=null;this.src='https://via.placeholder.com/40';">` : 
      '';
    return `
      <li>
        ${index + 1}. 
        ${img}
        ${ingredient.name}
      </li>
    `;
  }).join('');

  const youtubeLink = meal.strYoutube ? `
    <a href="${meal.strYoutube}" target="_blank" class="youtube-link">
      <i class="fa fa-youtube-play"></i> Watch on YouTube
    </a>
  ` : '';

  container.innerHTML = `
    <div class="meal-details">
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-image">
      <div class="meal-meta">
        <p><strong>Category:</strong> ${meal.strCategory || 'Unknown'}</p>
        <p><strong>Area:</strong> ${meal.strArea || 'Unknown'}</p>
        ${meal.strTags ? `<p><strong>Tags:</strong> ${meal.strTags}</p>` : ''}
      </div>
      <h2>Ingredients</h2>
      <ul>${ingredientsList}</ul>
      <h2>Instructions</h2>
      <div class="instructions">${formatInstructions(meal.strInstructions)}</div>
      ${youtubeLink}
    </div>
  `;
}

// Helper function to get ingredients with image URL
function getIngredientsList(meal) {
  let ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        name: `${measure || ''} ${ingredient}`.trim(),
        imageUrl: `https://www.themealdb.com/images/ingredients/${ingredient}.png`
      });
    }
  }
  return ingredients;
}

// Helper function to format instructions with paragraphs
function formatInstructions(instructions) {
  if (!instructions) return '<p>No instructions available.</p>';
  return instructions.split('\r\n').filter(step => step.trim()).map(step => `<p>${step}</p>`).join('');
}

// Initialize with some meals on page load
window.addEventListener('DOMContentLoaded', () => {
  fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=')
    .then(response => response.json())
    .then(data => {
      if (data.meals) {
        renderMealResults(data.meals.slice(0, 12)); // Show first 12 meals
      }
    });
});