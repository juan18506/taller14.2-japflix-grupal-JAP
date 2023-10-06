const moviesEndpoint = "https://japceibal.github.io/japflix_api/movies-data.json";

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch(moviesEndpoint);
  const data = await res.json();

  document.getElementById("searchButton").addEventListener("click", () => {
    const search = document.getElementById("searchInput").value.toLowerCase();
    if (search.length === 0) return;

    const filteredData = data.filter(({ title, genres, tagline, overview }) =>
      title.toLowerCase().includes(search) ||
      tagline.toLowerCase().includes(search) ||
      overview.toLowerCase().includes(search) ||
      genres.filter(({ name }) => name.toLowerCase().includes(search)).length > 0
    );

    filteredData.forEach(({ title, tagline, vote_average }) => {
      const stars = (vote_average / 2).toFixed();
      let starsDom = "";
      for (let i = 0; i < 5; i++) {
        starsDom += `
          <span class="fa fa-star ${i < stars ? "checked" : ""}"></span>
        `;
      };

      document.getElementById("list").innerHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-center" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom">
          <div>
            <h3>${ title }</h3>
            <p>${ tagline }</p>
          </div>
          
          <div>
            ${ starsDom }
          </div>
        </li>
      `;
    });

    const listsItems = document.getElementById("list").children;
    for (const li of listsItems) {
      li.addEventListener("click", ({ currentTarget }) => {
        const movie = filteredData.find(({ title }) => title === currentTarget.firstElementChild.firstElementChild.innerHTML);

        document.getElementById("offcanvasBottomLabel").innerHTML = movie.title;
        document.getElementById("offcanvasBody").innerHTML = movie.overview;
        document.getElementById("offcanvasGenres").innerHTML = "";
        movie.genres.forEach(({ name }) => {
          document.getElementById("offcanvasGenres").innerHTML += `
            <span>${ name } - </span>
          `;
        });

        const movieYear = new Date(movie.release_date).getFullYear();
        document.getElementById("offcanvasYear").innerHTML = movieYear;
        document.getElementById("offcanvasRuntime").innerHTML = `${ movie.runtime } mins`;
        document.getElementById("offcanvasBudget").innerHTML = `$${ movie.budget }`;
        document.getElementById("offcanvasRevenue").innerHTML = `$${ movie.revenue }`;
      });
    };
  });
});
