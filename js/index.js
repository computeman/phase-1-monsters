// js/index.js

const createMonsterForm = document.querySelector("#monster-form");
const monsterContainer = document.querySelector("#monster-container");
const forward = document.querySelector("#forward");
const back = document.querySelector("#back");

let currentPage = 1; // Track the current page
const itemsPerPage = 50; // Number of items to display per page

const displayCards = () => {
  const url = `http://localhost:3000/monsters/?_limit=${itemsPerPage}&_page=${currentPage}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // Clear previous content
      monsterContainer.innerHTML = "";

      data.forEach((monster) => {
        const monstercard = document.createElement("div");
        monstercard.classList.add("monster-card");
        const name = document.createElement("p");
        const description = document.createElement("p");
        const age = document.createElement("p");
        description.textContent = `Description: ${monster.description}`;
        name.textContent = `Name: ${monster.name}`;
        age.textContent = `Age: ${monster.age}`;

        monstercard.appendChild(name);
        monstercard.appendChild(age);
        monstercard.appendChild(description);
        monsterContainer.append(monstercard);
      });

      // Enable/disable navigation buttons based on the current page
      if (currentPage === 1) {
        back.disabled = true;
      } else {
        back.disabled = false;
      }

      // Check if there are more pages to load
      if (data.length === itemsPerPage) {
        forward.disabled = false;
      } else {
        forward.disabled = true;
      }
    });
};

// Create "Create Monster" button
const createMonsterButton = document.createElement("button");
createMonsterButton.textContent = "Create Monster";
createMonsterButton.addEventListener("click", createMonster);

// Append the button to the form
createMonsterForm.appendChild(createMonsterButton);

// Function to handle creating a new monster
function createMonster() {
  const name = document.querySelector("#name").value;
  const age = document.querySelector("#age").value;
  const description = document.querySelector("#description").value;

  // Validate inputs
  if (name && age && description) {
    // Create a new monster object
    const newMonster = {
      name,
      age,
      description,
    };

    // Post the new monster to the API
    fetch("http://localhost:3000/monsters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMonster),
    })
      .then((res) => res.json())
      .then((data) => {
        // After successful creation, display the new monster
        displayCards();
      });
  } else {
    alert("Please fill in all fields");
  }
}

// Function to load the next set of monsters
const loadNextPage = () => {
  currentPage++;
  displayCards();
};

forward.addEventListener("click", loadNextPage);

// Display the first set of items
displayCards();
