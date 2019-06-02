// function myFunction() {
//     fetch("https://developer.nps.gov/api/v1/parks?api_key=NrFMJhXv9gb93wxxB8x9PrFYV7AAfekpVuwSfVXW")  //start the download
//     .then(function(response) {  //when done downloading
//         let dataPromise = response.json();  //start encoding into an object
//         return dataPromise;  //hand this Promise up
//     })
//     .then(function(data) {  //when done encoding
//         console.log(data)
        
//         data.forEach(function(park)) {

//         });
//         });
//   }


//     let elem = document.querySelector('p');
//     // elem.textContent = 'a=s'

// let elem = document.querySelector('parkName');
// elem.textContent = myFunction()
var lastNameUsed = "";
var mymap = L.map('mapid').setView([37.505, -95], 5);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiY29ubmVydyIsImEiOiJjandjdDBxaWwwamhpNGFudTFid2pkbmh0In0.au27WRMDuKhNlPddEK8RCw'
}).addTo(mymap);

//state
let state = {
    inputtedState: '',
    inputtedType: '',
    marker: '',
    markers: [],
    url: '',
    statedata: []
};

//Getting user input from forms
let form = document.querySelector('form');
form.addEventListener('submit', function(event) {
    event.preventDefault();
    let stateInput = document.querySelector('#stateInput');
    let categoryInput = document.querySelector('#type');
    let url = "https://developer.nps.gov/api/v1/";

   state.inputtedState = stateInput.value;
   state.inputtedType = categoryInput.value;
    url = url + state.inputtedType + "?stateCode=" + state.inputtedState+ "&api_key=NrFMJhXv9gb93wxxB8x9PrFYV7AAfekpVuwSfVXW";
    
    let data = fetch(url,{mode: 'cors'});

    data.then(function (response) {
        return response.json();
    }).then(function (newdata) {
        newdata = newdata.data;
      console.log(newdata);
      //resetMap()

    getItems(newdata);


      getMap();
      makeList();
    })

    
})

artURL = "https://developer.nps.gov/api/v1/articles?api_key=NrFMJhXv9gb93wxxB8x9PrFYV7AAfekpVuwSfVXW"
let articles = fetch(artURL,{mode: 'cors'});
articles.then(function (response){
    return response.json();
}).then(function (newarticles){
    newarticles = newarticles.data;
    makeArticles(newarticles);
})


function getItems(newdata) {
    newdata.forEach(function(item) {
            state.statedata.push(item)
    });
    console.log(state.statedata);
} 

function getMap() {
    let marker;
    var data = state.statedata;
    
    for(let i = 0; i < data.length; i++) {
        if (data[i].latLong != "") {
            latitude = data[i].latLong.split(',')[0].split(':')[1]
            latitude = latitude.substring(0, latitude.length - 1);
            longitude = data[i].latLong.split(',')[1].split(':')[1]
            longitude = longitude.substring(0, longitude.length - 1);
            // console.log(data[i].latLong.split(',')[0].split(':')[1])
            // console.log(data[i].latLong.split(',')[1].split(':')[1])
            console.log(latitude)
            console.log(longitude)
            if(longitude != null) {
                marker = L.marker([latitude, longitude]);
                mymap.addLayer(marker);
                marker.addTo(mymap);
                if (data[i].name != null){
                    nameLink = '<a href="#' + data[i].name+ '">' + data[i].name+ '</a>'
                    lastNameUsed = data[i].name;
                     marker.bindPopup(nameLink);
                } else { 
                    nameLink = '<a href="#' + data[i].title+ '">' + data[i].title+ '</a>'
                    lastNameUsed = data[i].title;
                    marker.bindPopup(nameLink);
                }
                state.marker = marker;
                state.markers.push(marker);
            }
        }
    }
}

function makeList() {
    var data = state.statedata;


    let listDiv = document.querySelector('#list');
    let arttitle = document.createElement('h1');
    arttitle.textContent = "Adventure Near You"
    listDiv.appendChild(arttitle)

    if (state.inputtedType == "parks") {
        for(let i = 0; i < data.length; i++) {
            let main = document.createElement('div');
            main.classList.add("listCard");

            var name = data[i].name;
            let newName = document.createElement('a');
            newName.setAttribute('name', name);
            newName.textContent = name;

            main.appendChild(newName);

            var parkurl = data[i].url;
            let newparkurl = document.createElement('p');
            newparkurl.textContent = "Park Website: " + parkurl;
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
        for(let i = 0; i < data.length; i++) {
            let main = document.createElement('div');
            main.classList.add("listCard");

            var name = data[i].name;
            let newName = document.createElement('a');
            newName.setAttribute('name', name);
            newName.textContent = name;
            main.appendChild(newName);

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
        for(let i = 0; i < data.length; i++) {
            let main = document.createElement('div');
            main.classList.add("listCard");

            var name = data[i].title;
            let newName = document.createElement('a');
            newName.setAttribute('name', name);
            newName.textContent = name;
            main.appendChild(newName);

            var parkurl = data[i].url;
            let newparkurl = document.createElement('p');
            newparkurl.textContent = "Park Website: " + parkurl;
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
    if (state.inputtedType == "parks") {
        for(let i = 0; i < data.length; i++) {
            let main = document.createElement('div');
            main.classList.add("listCard");

            var name = data[i].name;
            let newName = document.createElement('a');
            newName.setAttribute('name', name);
            newName.textContent = name;

            main.appendChild(newName);

            var parkurl = data[i].url;
            let newparkurl = document.createElement('p');
            newparkurl.textContent = "Park Website: " + parkurl;
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
    if (state.inputtedType == "visitorcenters") {
        for(let i = 0; i < data.length; i++) {
            let main = document.createElement('div');
            main.classList.add("listCard");

            var name = data[i].name;
            let newName = document.createElement('a');
            newName.setAttribute('name', name);
            newName.textContent = name;
            main.appendChild(newName);

            var parkurl = data[i].url;
            let newparkurl = document.createElement('p');
            newparkurl.textContent = "Park Website: " + parkurl;
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

function makeArticles(newarticles) {
    let listDiv = document.querySelector('#articles');
    let arttitle = document.createElement('h1');
    arttitle.textContent = "Articles"
    listDiv.appendChild(arttitle)
    for(let i = 0; i < newarticles.length; i++) {

        let main = document.createElement('div');
        main.classList.add("listCard");

        var title = newarticles[i].title;
        let url = newarticles[i].url;
        let newName = document.createElement('a');
        newName.setAttribute('href',url)
        newName.textContent= title
        main.appendChild(newName);


        let lineBreak = document.createElement('br');
        main.appendChild(lineBreak);


       

        var photoUrl = newarticles[i].listingimage.url;
        var altText = newarticles[i].listingimage.altText
        let newphoto = document.createElement('img');

        newphoto.setAttribute('src', photoUrl)
        newphoto.setAttribute('alt', altText)
        newphoto.setAttribute('width', "250")
        newphoto.setAttribute('height', "250")
        main.appendChild(newphoto);


        var desc = newarticles[i].listingdescription;
        let newDesc = document.createElement('p');
        newDesc.textContent = "Description: " + desc;
        main.appendChild(newDesc);

        listDiv.appendChild(main);
    }
}