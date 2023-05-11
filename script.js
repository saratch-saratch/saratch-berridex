const dexList = document.querySelector(".dex-display__list");

const createItem = (berry) => {
  const newItem = document.createElement("li");
  newItem.setAttribute("id", berry.id);
  newItem.classList.add("dex-item");

  const dexImage = document.createElement("img");
  dexImage.classList.add("dex-item__image");
  dexImage.setAttribute("src", berry.sprite);
  newItem.appendChild(dexImage);

  const createText = (text, parent, className) => {
    const element = document.createElement("p");
    element.classList.add("dex-item__text");
    if (className !== undefined) element.classList.add(className);
    element.innerText = text;
    parent.appendChild(element);
  };

  createText(berry.name, newItem, "dex-item__text--alt");
  createText(`No. ${berry.id}`, newItem);

  const wrapper = document.createElement("div");
  wrapper.classList.add("dex-item__wrapper");
  newItem.appendChild(wrapper);

  createText(`Flavor: ${berry.flavor.flavor.name} (${berry.flavor.potency})`, wrapper);
  createText(`Smooth: ${berry.smooth}`, wrapper);
  createText(berry.effect, wrapper);

  //append to index.html
  dexList.appendChild(newItem);
};

const clickEvent = () => {
  const items = document.querySelectorAll(".dex-item");
  items.forEach((item) => {
    item.addEventListener("click", (event) => {
      const selectedItem = document.querySelector(".dex-item--active");
      if (selectedItem) selectedItem.classList.remove("dex-item--active");
      event.currentTarget.classList.add("dex-item--active");
    });
  });
};

const displayDex = (num) => {
  axios.get(`https://pokeapi.co/api/v2/berry?offset=${num}&limit=6`).then((response) => {
    const basket = response.data.results;
    basket.map((element) => {
      axios
        .get(element.url)
        .then((response) => {
          const berry = response.data;
          axios
            .get(berry.item.url)
            .then((response) => {
              const berryItem = response.data;
              let berryObject = {
                sprite: berryItem.sprites.default,
                name: berry.name,
                id: berry.id,
                flavor: berry.flavors.find((object) => object.potency > 0),
                smooth: berry.firmness.name,
                effect: berryItem.effect_entries[0].short_effect,
              };
              createItem(berryObject);
              clickEvent();
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    });
  });
};

const changePage = (page, num) => {
  document.getElementById(page).addEventListener("click", (event) => {
    event.preventDefault();
    removeItems();
    displayDex(num);
  });
};

const changePageAll = () => {
  changePage("page1", 0);
  changePage("page2", 6);
  changePage("page3", 12);
  changePage("page4", 19);
  changePage("page5", 24);
  changePage("page6", 30);
};

const removeItems = () => {
  const items = document.querySelectorAll(".dex-item");
  items.forEach((element) => {
    if (element) element.remove();
    else return;
  });
};

const clickNavEvent = () => {
  document.querySelector(".dex-nav__link").classList.add("dex-nav__link--active");
  const items = document.querySelectorAll(".dex-nav__link");
  items.forEach((item) => {
    item.addEventListener("click", (event) => {
      const selectedItem = document.querySelector(".dex-nav__link--active");
      if (selectedItem) selectedItem.classList.remove("dex-nav__link--active");
      event.currentTarget.classList.add("dex-nav__link--active");
    });
  });
};

clickNavEvent();
displayDex(0);
changePageAll();
