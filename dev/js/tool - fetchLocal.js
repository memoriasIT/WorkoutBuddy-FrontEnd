function fetchLocal (con) {

    /*
    let con = {
        task: "multisearch",
        movieID: null,
        pageNr: 1,
        genreID: null,
        query: "sylvester"
    }

    */

    const APIkey        = "c6aea5536b7de40d0294eb356df3c3df";
    const languageUS    = "&language=en-US";
    const adult         = "&include_adult=false";
    const video         = "&include_video=false";

    function fetchFunction (URL, task) {
        return fetch(URL)
            .then(response => handleErrors(response, task))
            .then(response => response.json())
            .then(response => { console.log(response); return response })
            .catch(error   => console.log("Local data fetch failed"))
    }


    if (con.task == "movie") {
        console.log("TASK = MOVIE")
        const URL = `http://127.0.0.1:8000/exercise/${con.movieID}`;
        return fetchFunction(URL, con.task);
    }

    if (con.task == "multisearch") {
        console.log("TASK = MULTISEARCH")
        console.log(con.query)
        const URL = `http://127.0.0.1:8000/exercise/${con.query}`;
        return fetchFunction(URL, con.task);
    }

    if (con.task == "actor") {
        console.log("TASK = ACTOR")
        const URL = `http://127.0.0.1:8000/exercise/${con.movieID}`;
        // const URL = `https://api.themoviedb.org/3/person/${con.personID}?api_key=${APIkey}${languageUS}&append_to_response=movie_credits`;
        return fetchFunction(URL, con.task);
    }

    if (con.task == "discover") {
        console.log("TASK = DISCOVERAAAA")
        monitorMovieElements.current_page += 1;
        const settings = assembleSettings(con.settings);
        var data = JSON.stringify({ "exercise" : "chest" });
        const URL = `https://6323-35-245-16-71.ngrok.io/predictId/Chest`;
        var head = { "Content-Type" : "application/json" };
        // return fetchFunction(URL, con.task);
        return fetch(URL, { method: "POST", data: data }).then((result) => { return result.json(); });

    }
}




// ================== HELPERS ==================

function handleErrors(response, task) {
    if (!response.ok) {
        console.log(response);
        console.log(`${task}      <=========== following task failed`);
    }
    return response;
}


function assembleSettings (settings) {
    let genres      = `with_genres=${getGenreID(settings.filtering.genre)}`;
    let rating_gte  = `vote_average.gte=${settings.filtering.rating[0]}`;
    let rating_lte  = `vote_average.lte=${settings.filtering.rating[1]}`;
    let runtime_gte = `with_runtime.gte=${settings.filtering.runtime[0]}`;
    let runtime_lte = `with_runtime.lte=${settings.filtering.runtime[1]}`;
    let year_gte    = `primary_release_date.gte=${settings.filtering.year[0]}-01-01`;
    let year_lte    = `primary_release_date.lte=${settings.filtering.year[1]}-01-01`;

    let stringSettings = `&${genres}&${rating_gte}&${rating_lte}&${runtime_gte}&${runtime_lte}&${year_gte}&${year_lte}`
    return stringSettings;
}


function getGenreID (genreSettings) {
    let genreString = "";
    for (let i = 0; i < genreSettings.length; i++) {
        if (i != 0) { genreString += "," }
        genreString += genreList[genreSettings[i]]
    }
    return genreString;
}


let genreList = {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    fantasy: 14,
    history: 36,
    horror: 27,
    mystery: 9648,
    romance: 10749,
    scifi: 878,
    thriller: 53,
    war: 10752,
    western: 37
};
