const housesUrl = "4-2.json";

async function fetchHouses() {
  const response = await fetch(housesUrl);
  return await response.json();
}
async function renderHouses() {
  const houses = await fetchHouses();
  const housesElement = document.getElementById("houses");
  // remove existing elements
  housesElement.innerHTML = "";

  // Get checkbox state
  const sizeFilter = document.getElementById("sizeFilter").checked;
  const priceFilter = document.getElementById("priceFilter").checked;

  // Filter houses
  let filteredHouses = houses;
  if (sizeFilter) {
    filteredHouses = filteredHouses.filter(house => house.size < 200);
  }
  if (priceFilter) {
    filteredHouses = filteredHouses.filter(house => house.price < 1000000);
  }

  filteredHouses.forEach(house => {
    const houseContainer = document.createElement("div");
    houseContainer.classList.add("houseContainer");

    const houseImage = document.createElement("img");
    houseImage.classList.add("houseImage");
    houseImage.src = house.image;

    const textContainer = document.createElement("div");
    textContainer.classList.add("textContainer");

    const header = document.createElement("p");
    header.classList.add("header");
    header.textContent = house.address;

    const size = document.createElement("p");
    size.textContent = `${house.size} sqm`;

    const text = document.createElement("p");
    text.textContent = house.text;

    const price = document.createElement("p");
    price.textContent = `€${house.price}`;

    textContainer.appendChild(header);
    textContainer.appendChild(size);
    textContainer.appendChild(text);
    textContainer.appendChild(price);

    houseContainer.appendChild(houseImage);
    houseContainer.appendChild(textContainer);

    housesElement.appendChild(houseContainer);
  });
}
renderHouses();