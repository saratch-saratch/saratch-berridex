const API_BASE_URL = "https://pokeapi.co/api/v2/berry";
const dexList = document.querySelector(".dex-display__list");

const createItem = (berry, berryItem, flavor) => {
  const newItem = document.createElement("li");
  newItem.setAttribute("id", berry.id);
  newItem.classList.add("dex-item");

  const dexImage = document.createElement("img");
  dexImage.classList.add("dex-item__image");
  dexImage.setAttribute("src", berryItem.sprites.default);
  newItem.appendChild(dexImage);

  const createText = (text, className) => {
    const element = document.createElement("p");
    element.classList.add("dex-item__text");
    if (className !== undefined) element.classList.add(className);
    element.innerText = text;
    newItem.appendChild(element);
  };

  createText(berry.name, "dex-item__text--alt");
  createText(`No. ${berry.id}`);
  createText(`Flavor: ${flavor.flavor.name} (${flavor.potency})`);
  createText(`Smooth: ${berry.firmness.name}`);
  createText(berryItem.effect_entries[0].short_effect);

  //append to index.html
  dexList.appendChild(newItem);
};

const displayDex = (num1, num2) => {
  for (let i = num1; i <= num2; i++) {
    axios
      .get(`${API_BASE_URL}/${i}`)
      .then((response) => {
        const berry = response.data;
        axios
          .get(berry.item.url)
          .then((response) => {
            const berryItem = response.data;
            let flavor = berry.flavors.find((object) => object.potency > 0);
            createItem(berry, berryItem, flavor);
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  }
};

const changePage = (page, num1, num2) => {
  document.getElementById(page).addEventListener("click", (event) => {
    event.preventDefault();
    removeItems();
    displayDex(num1, num2);
  });
};

const changePageAll = () => {
  changePage("indexPage", 1, 6);
  changePage("page1", 1, 6);
  changePage("page2", 7, 12);
  changePage("page3", 13, 18);
  changePage("page4", 19, 24);
  changePage("page5", 25, 30);
  changePage("page6", 31, 35);
};

const removeItems = () => {
  const items = document.querySelectorAll(".dex-item");
  items.forEach((element) => {
    element.remove();
  });
};

displayDex(1, 6);
changePageAll();
