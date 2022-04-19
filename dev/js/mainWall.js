let mwsMoviesContainer       =   document.getElementById('mws-movies-container')
let mwsPersonsContainer      =   document.getElementById('mws-persons-container')

let mwsMovies                =   document.getElementById('mws-movies')
let mwsPersons               =   document.getElementById('mws-persons')

let mwsMoviesQueryResult     =   document.getElementById('mws-results-movies');
let mwsPersonsQueryResult    =   document.getElementById('mws-results-persons');

let mwsQuery                 =    document.getElementById('mws-query');

mwsMoviesContainer.addEventListener('click', function (e) {
    controllerMovieOverlay("open", returnDataId(e));
});

mwsPersonsContainer.addEventListener('click', function (e) {
    mainSectionController(mainActors, returnDataId(e).id)
})

function returnDataId (e) {
    let mwsItem = e.target.parentNode;

    if (mwsItem.hasAttribute('data-id')) {
        return movieAPI.getMovieById(mwsItem.getAttribute('data-id'));
    }
    if (mwsItem.parentNode.hasAttribute('data-id')) {
        return movieAPI.getMovieById(mwsItem.getAttribute('data-id'));
    }

    return;
}

function controllerSearch (query) {

        Promise.all([
            startFetch({ task: "multisearch", query: query, pageNr: 1 }),
            startFetch({ task: "multisearch", query: query, pageNr: 2 }),
            startFetch({ task: "multisearch", query: query, pageNr: 3 }) ])
        .then(resp => {
            let concatResp  = resp[0]//.results.concat(resp[1].results).concat(resp[2].results)

            movieAPI.setMovieArr(concatResp)
            return {concatResp: concatResp, total: 1
            } })
        .then(resp => {
            assembelSearch(resp.concatResp, query, resp.total)
        })

        function startFetch (con) {
            return fetchLocal(con)
        }


}


function assembelSearch (response, query, totalNumbers) {
    mwsQuery.textContent = query;

    // Resetting search results
    mwsMoviesContainer.textContent = "";
    mwsPersonsContainer.textContent = "";

    mwsMovies.classList.remove('mws-visible');
    mwsPersons.classList.remove('mws-visible');

    let imageForExercise;
    fetch(`https://wger.de/api/v2/exerciseimage/${query}/?format=json`).then((response)=>{  return response.json();  // converting byte data to json
    }).then(data=>{
       const {id, uuid, exercise_base, image, is_main, status, style} = data;
       console.log(image);
       console.log(data.image);

       imageForExercise = data.image;
        let m   =   response;
        mwsMovies.classList.add("mws-visible");

        let item =  createMwsItem(m.name, m.creation_date, m.description, "fa fa-calendar", imageForExercise)
        item.setAttribute('data-id', `${m.id}`);
        mwsMoviesContainer.appendChild(item)

 })

}


    function createMwsItem (title, release_date, overview, icon, img, id) {
        let div     =   document.createElement('div');
        div.className = "mws-item";
        div.appendChild(createPosterItem(img))
        div.appendChild(createH3Item(title))
        div.appendChild(createH5Item(release_date, icon))
        div.appendChild(createPItem(overview))
        return div;
    }

        function createPosterItem (img) {
            let posterItem  =   document.createElement('img');
            posterItem.className = "mws-poster-item";
            posterItem.setAttribute('style', `background-image: url('${img}')`);
            return posterItem;
        }

        function createH3Item (title) {
            let h3Item  =   document.createElement('h3');
            h3Item.className = "mws-h3-item";
            h3Item.textContent = title;
            return h3Item;
        }

        function createH5Item (date, icon) {
            let span            =   document.createElement('span');
            let span2           =   document.createElement('span');
            let h5Item          =   document.createElement('h5');
            span.className      =   icon;
            span2.textContent   =   date;
            h5Item.className    =   "mws-h5-item";

            h5Item.appendChild(span)
            h5Item.appendChild(span2)
            return h5Item;
        }

        function createPItem (overview) {
            let p           =   document.createElement('p');
            p.className     =   "mws-p-item";
            p.textContent   =   overview;
            return p;
        }
