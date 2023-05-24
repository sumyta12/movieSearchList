import { baseurl, apikey } from "./config.js";
let watchlistArr = [];
async function getMovieData(urlink) {
  const url = await fetch(urlink);
  if (!url.ok) {
    document.querySelector(".errortext").textContent = "Error fetching Url ";
  } else {
    const response = await url.json();
    return response;
  }
}

document.querySelector("button").addEventListener("click", function () {
  document.querySelector(".errortext").textContent = ``;
  const input = document.querySelector("input");
  const inputValue = input.value ? input.value : "Blade Runner";
  getMovieData(`${baseurl}?s=${inputValue}&apikey=${apikey}`).then((data) => {
    if (data.Response === "False") {
      document.querySelector(".movieIcone").classList.add("hide");
      return (document.querySelector(".errortext").textContent =
       ` I am not finding any movies 🤐 ${inputValue}` );
    } else {
      return getMovieDataDisplay(data.Search);
    }
  });
});

function getMovieDataDisplay(data) {
  let text = ``;
  for (let datas of data) {
    const { Poster, Title, active } = datas;
    let watchtext = ``;
    let emojiwatchtext = ``;
    !active ? (watchtext = "watch") : (watchtext = "cancel");
    !active ? (emojiwatchtext = "➕") : (emojiwatchtext = "➖");

    text += ` <div class="row-card">
                  <div class="row-img">
                    <img src=${Poster} />
                  </div>
                  <div class="row-info">
                    <div class="row-info-top">
                      <div class="row">
                        <div class="col">
                          <p class="searchh1">${Title}</p>
                        </div>
                        <div class="col">
                          <span>⭐ 8.1</span>
                        </div>
                      </div>
                    </div>
                    <div class="row-info-middle">
                      <div class="row">
                        <div class="col-row">
                          <span>116 min</span>
                        </div>
                        <div class="col-row">
                          <span>Drama, Mystery, Sci-fi</span>
                        </div>
                        <div class="col-row">
                          <span class='${watchtext}${datas.imdbID}' data-info=${datas.imdbID}>${emojiwatchtext} ${watchtext}</span>
                        </div>
                      </div>
                    </div>
                    <div class="row-info-end">
                      <p class="row-description">
                        A blade runner must pursue and terminate four replicants who stole a
                        ship in space, and have returned to Earth to find their creator.
                      </p>
                    </div>
                  </div>
    </div>`;
  }
  document.querySelector(".movieIcone").classList.add("hide");
  document.querySelector(".movieOutput .container").innerHTML = text;
}
document.addEventListener("click", function (e) {
  if (e.target.dataset.info) {
    if (document.querySelector(".watch" + e.target.dataset.info)) {
      document.querySelector(
        ".watch" + e.target.dataset.info
      ).textContent = `❤ added to watch list`;

      const imdbid = e.target.dataset.info;
      const url = getMovieData(`${baseurl}?i=${imdbid}&apikey=${apikey}`);
      url.then((data) => {
        data.active = true;
        watchlistArr.push(data);
      });
    } else if (document.querySelector(".cancel" + e.target.dataset.info)) {
      const newArr = [];
      watchlistArr.forEach((item) => {
        if (item.imdbID !== e.target.dataset.info) {
          newArr.push(item);
        }
      });
      watchlistArr = newArr;
      getMovieDataDisplay(watchlistArr);
      if (newArr.length === 0) {
        document.querySelector(".errortext").textContent =
          "You are not yet added anything to the watch list";
      }
    }
  }
});
document.querySelector(".mywatchlist").addEventListener("click", function () {
  if (watchlistArr.length === 0) {
    document.querySelector(".movieOutput .container").innerHTML = ``;
    document.querySelector(".movieIcone").classList.add("hide");
    document.querySelector(".errortext").textContent =
      "You are not yet added anything to the watch list";
  } else {
    const newArr = [];
    const watcharr = watchlistArr.filter(function (item) {
      const duplicate = newArr.includes(item.imdbID);
      if (!duplicate) {
        newArr.push(item.imdbID);
        return true;
      } else {
        return false;
      }
    });
    watchlistArr = watcharr;
    getMovieDataDisplay(watchlistArr);
  }
});
