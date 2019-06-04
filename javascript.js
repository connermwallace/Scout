var lastNameUsed = "";
var mymap = L.map('mapid').setView([37.505, -95], 5);
mymap.scrollWheelZoom.disable();


L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.emerald',
    accessToken: 'pk.eyJ1IjoiY29ubmVydyIsImEiOiJjandjdDBxaWwwamhpNGFudTFid2pkbmh0In0.au27WRMDuKhNlPddEK8RCw'
}).addTo(mymap);


// Current state of the page
let state = {
    inputtedState: '',
    inputtedType: '',
    marker: '',
    markers: [],
    url: '',
    statedata: []
};


let form = document.querySelector('form');
form.addEventListener('submit', function (event) {
    event.preventDefault();
    let stateInput = document.querySelector('#stateInput');
    let categoryInput = document.querySelector('#type');
    // Base URL
    let url = "https://developer.nps.gov/api/v1/";

    state.inputtedState = stateInput.value;
    state.inputtedType = categoryInput.value;

    // Build URL given category and state
    url = url + state.inputtedType + "?stateCode=" + state.inputtedState + "&api_key=NrFMJhXv9gb93wxxB8x9PrFYV7AAfekpVuwSfVXW";

    let data = fetch(url, { mode: 'cors' });

    data.then(function (response) {
        return response.json();
    }).then(function (newdata) {
        newdata = newdata.data;
        resetMap();
        resetCards();
        getItems(newdata);
        getMap();
        makeList();
    })


})

// Get data for articles
artURL = "https://developer.nps.gov/api/v1/articles?api_key=NrFMJhXv9gb93wxxB8x9PrFYV7AAfekpVuwSfVXW"
let articles = fetch(artURL, { mode: 'cors' });
articles.then(function (response) {
    return response.json();
}).then(function (newarticles) {
    newarticles = newarticles.data;
    makeArticles(newarticles);
})

function getItems(newdata) {
    newdata.forEach(function (item) {
        state.statedata.push(item)
    });
}

// Builds the map and adds markers
function getMap() {
    let marker;
    var data = state.statedata;

    for (let i = 0; i < data.length; i++) {
        if (data[i].latLong != "") {
            latitude = data[i].latLong.split(',')[0].split(':')[1]
            latitude = latitude.substring(0, latitude.length - 1);
            longitude = data[i].latLong.split(',')[1].split(':')[1]
            longitude = longitude.substring(0, longitude.length - 1);
            if (latitude != null) {
                marker = L.marker([latitude, longitude]);
                mymap.addLayer(marker);
                marker.addTo(mymap);
                if (data[i].name != null) {
                    nameLink = '<a href="#' + data[i].name + '">' + data[i].name + '</a>'
                    lastNameUsed = data[i].name;
                    marker.bindPopup(nameLink);
                } else {
                    nameLink = '<a href="#' + data[i].title + '">' + data[i].title + '</a>'
                    lastNameUsed = data[i].title;
                    marker.bindPopup(nameLink);
                }
                state.marker = marker;
                state.markers.push(marker);
            }
        }
    }
}

// Makes the cards for the different parks/campgrounds (depends on category chosen by user)
function makeList() {
    var data = state.statedata;
    let listDiv = document.querySelector('#list');
    let showTitle = document.querySelector('.ArticleTitle');
    showTitle.style.display="block";
    // Different categories have different title for the fields we want, we need different
    // for loops to build the cards for all the categories.
    if (state.inputtedType == "parks") {
        for (let i = 0; i < data.length; i++) {
            let main = document.createElement('div');
            main.classList.add("listCard");

            var name = data[i].name;
            let newName = document.createElement('a');
            newName.setAttribute('name', name);
            let titlename = document.createElement('h3');
            titlename.textContent = name + " Park";
            main.appendChild(newName);
            main.appendChild(titlename);

            let lineBreak = document.createElement('br');
            main.appendChild(lineBreak);

            var parkurl = data[i].url;
            let newparkurl = document.createElement('a');
            newparkurl.setAttribute("href", parkurl);
            newparkurl.textContent = "Park Website";
            main.appendChild(newparkurl);

            var desc = data[i].description;
            let newDesc = document.createElement('p');
            newDesc.textContent = "Description: " + desc;
            main.appendChild(newDesc);

            var direct = data[i].directionsInfo;
            let newdirect = document.createElement('p');
            newdirect.textContent = "Directions: " + direct;
            main.appendChild(newdirect);

            var weather = data[i].weatherInfo;
            let newweather = document.createElement('p');
            newweather.textContent = "Weather Information: " + weather;
            main.appendChild(newweather);

            var desig = data[i].designation;
            let newdesig = document.createElement('p');
            newdesig.textContent = "Designation: " + desig;
            main.appendChild(newdesig);
            listDiv.appendChild(main);
        }
    }
    if (state.inputtedType == "campgrounds") {
        for (let i = 0; i < data.length; i++) {
            let main = document.createElement('div');
            main.classList.add("listCard");

            var name = data[i].name;
            let newName = document.createElement('a');
            newName.setAttribute('name', name);
            let titlename = document.createElement('h3');
            titlename.textContent = name;
            main.appendChild(newName);
            main.appendChild(titlename);

            var desc = data[i].description;
            let newDesc = document.createElement('p');
            newDesc.textContent = "Description: " + desc;
            main.appendChild(newDesc);

            var direct = data[i].directionsoverview;
            let newdirect = document.createElement('p');
            newdirect.textContent = "Directions: " + direct;
            main.appendChild(newdirect);

            var weather = data[i].weatheroverview;
            let newweather = document.createElement('p');
            newweather.textContent = "Weather Information: " + weather;
            main.appendChild(newweather);
            listDiv.appendChild(main);

        }
    }
    if (state.inputtedType == "places") {
        for (let i = 0; i < data.length; i++) {
            let main = document.createElement('div');
            main.classList.add("listCard");

            var name = data[i].title;
            let newName = document.createElement('a');
            newName.setAttribute('name', name);
            let titlename = document.createElement('h3');
            titlename.textContent = name;
            main.appendChild(newName);
            main.appendChild(titlename);

            let lineBreak = document.createElement('br');
            main.appendChild(lineBreak);

            var parkurl = data[i].url;
            let newparkurl = document.createElement('a');
            newparkurl.setAttribute("href", parkurl);
            newparkurl.textContent = "Park Website";
            main.appendChild(newparkurl);

            var desc = data[i].listingdescription;
            let newDesc = document.createElement('p');
            newDesc.textContent = "Description: " + desc;
            main.appendChild(newDesc);


            var photoUrl = data[i].listingimage.url;
            var altText = data[i].listingimage.altText
            let newphoto = document.createElement('img');

            newphoto.setAttribute('src', photoUrl)
            newphoto.setAttribute('alt', altText)
            newphoto.setAttribute('width', "250")
            newphoto.setAttribute('height', "250")
            main.appendChild(newphoto);

            listDiv.appendChild(main);
        }
    }
    
    if (state.inputtedType == "visitorcenters") {
        for (let i = 0; i < data.length; i++) {
            let main = document.createElement('div');
            main.classList.add("listCard");

            var name = data[i].name;
            let newName = document.createElement('a');
            newName.setAttribute('name', name);
            let titlename = document.createElement('h3');
            titlename.textContent = name;
            main.appendChild(newName);
            main.appendChild(titlename);

            let lineBreak = document.createElement('br');
            main.appendChild(lineBreak);

            var parkurl = data[i].url;
            let newparkurl = document.createElement('a');
            newparkurl.setAttribute("href", parkurl);
            newparkurl.textContent = "Park Website";
            main.appendChild(newparkurl);

            var desc = data[i].description;
            let newDesc = document.createElement('p');
            newDesc.textContent = "Description: " + desc;
            main.appendChild(newDesc);

            var direct = data[i].directionsInfo;
            let newdirect = document.createElement('p');
            newdirect.textContent = "Directions: " + direct;
            main.appendChild(newdirect);

            listDiv.appendChild(main);
        }
    }
}
// Creates the cards for the articles section
function makeArticles(newarticles) {
    let listDiv = document.querySelector('#articles');
    let showTitle = document.querySelectorAll('.ArticleTitle')[1];
    showTitle.style.display="block";

    for (let i = 0; i < newarticles.length; i++) {
        let testLink = document.createElement('a');
        let url = newarticles[i].url;
        testLink.setAttribute("href", url);

        let main = document.createElement('div');
        main.classList.add("listCard");
        testLink.appendChild(main);
        // var title = newarticles[i].title;
        // let url = newarticles[i].url;
        // let newName = document.createElement('a');
        // newName.setAttribute('href', url)
        // newName.textContent = title.substring(0, 30) + "..."
        // main.appendChild(newName);
        var title = newarticles[i].title;
        let newName = document.createElement('h3');
        newName.textContent = title.substring(0, 35) + "..."
        main.appendChild(newName);

        let lineBreak = document.createElement('br');
        main.appendChild(lineBreak);

        var photoUrl = newarticles[i].listingimage.url;
        var altText = newarticles[i].listingimage.altText
        let newphoto = document.createElement('img');
        newphoto.setAttribute('src', photoUrl)
        newphoto.setAttribute('alt', altText)
        main.appendChild(newphoto);

        var desc = newarticles[i].listingdescription;
        let newDesc = document.createElement('p');
        newDesc.textContent = desc.substring(0, 50) + "...";
        main.appendChild(newDesc);

        testLink.appendChild(main);
        listDiv.appendChild(testLink);
    }
}

// Resets the map so the user can search multiple times without refreshing page
function resetMap() {
    for (let i = 0; i < state.markers.length; i++) {
        mymap.removeLayer(state.markers[i]);
    }
    state.marker = '';
    state.markers = [];
    state.statedata = [];

}

// Resets the cards so a new place/category can be chosen.
function resetCards() {
    document.getElementById('list').innerHTML = '';
}


