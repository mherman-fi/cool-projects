let names;
let selectedIndex = -1;

// Fetch names from jspm file and assign data to names variable
fetch("names.json")
  .then(response => response.json())
  .then(data => {
    names = data;
  });

// Find elements with id name-input and name-list and assign them to variables input and list
const input = document.getElementById("name-input");
const list = document.getElementById("name-list");

// Add event listener to input element
input.addEventListener("input", e => {
  const inputValue = e.target.value;
  list.innerHTML = "";
  selectedIndex = -1;
  
  // Filter names array when event is triggered
  if (inputValue.length > 0) {
    const filteredNames = names.filter(name => name.startsWith(inputValue));
    filteredNames.slice(0, 10).forEach(name => {
      const li = document.createElement("li");
      li.textContent = name;
      list.appendChild(li);
    });
  }
});

// Add event listener to input element to listen for keydown event
input.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && selectedIndex > 0) {
    selectedIndex--;
  } else if (e.key === "ArrowDown" && selectedIndex < list.children.length - 1) {
    selectedIndex++;
  } else if (e.key === "Enter") {
    input.value = list.children[selectedIndex].textContent;
    list.innerHTML = "";
    selectedIndex = -1;
  }
  
  // Highlight selection from list element
  Array.from(list.children).forEach((li, i) => {
    if (i === selectedIndex) {
      li.classList.add("highlight");
    } else {
      li.classList.remove("highlight");
    }
  });
});
