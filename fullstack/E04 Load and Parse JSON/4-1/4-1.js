const housesUrl = "4-1.json";

async function fetchHouses() {
  const response = await fetch(housesUrl);
  return await response.json();
}
async function renderHouses() {
  const houses = await fetchHouses();
  const housesElement = document.getElementById("houses");

  houses.forEach(house => {
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
    text.classList.add("text");
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