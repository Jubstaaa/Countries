getAll();

function enter(event) {
    if (event.key == "Enter") {
        let text=document.querySelector("#txtSearch").value;
         getCountry(text);
    }
}

document.querySelector("#btnSearch").addEventListener("click",()=>{
let text=document.querySelector("#txtSearch").value;
getCountry(text);
})

document.querySelector("#btnLocation").addEventListener("click",()=>{
document.querySelector("#loading").style.display="block";
document.querySelector("#details").style.opacity=0;
if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(onSuccess,onError);
}
})

async function onSuccess(position){
let lat = position.coords.latitude;
let lng = position.coords.longitude;

const api_key="f6e947ce58d64df3a9752e4f3b77d80a";
const url =`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${api_key}`;

const response = await fetch(url);
const data = await response.json();

const country = data.results[0].components.country;

document.querySelector("#txtSearch").value=country;
getCountry(country);
}

function onError(){
err = new Error("Location Permission Failed")
renderError(err);
}


async function getAll(){
        const response3 = await fetch('https://restcountries.com/v3.1/all');
        const allCountries = await response3.json();
        var countries=[]
        for(var x of allCountries){
            countries.push(x.name.common);
            countries.sort();   
        }
        for(var x of countries){
      
            let html=`
            <li class="list-group-item" onclick='getCountry(this.innerText)'>${x}</li>
            `
            document.querySelector("#allCountries").insertAdjacentHTML("beforeend",html);

        }
     
}

async function getCountry(country){
document.querySelector("#txtSearch").value=country;
document.querySelector("#details").style.opacity=0;
document.querySelector("#loading").style.display="block";
for(let i=0;i<document.querySelectorAll("#allCountries li").length;i++){
    document.querySelectorAll("#allCountries li")[i].style.display="none";
}
try {
        const response = await fetch('https://restcountries.com/v3.1/name/'+country);
        if(!response.ok)
                throw new Error("Country Not Found")
        const data = await response.json();
        renderCountry(data[0]);

        const countries=data[0].borders;
        if(!countries)
                throw new Error("Neighbor Country Not Found");
        const response2 = await fetch('https://restcountries.com/v3.1/alpha?codes='+countries.toString());
        const neighbors = await response2.json();
        renderNeighbors(neighbors);
}

catch(err){
    renderError(err);
}

}

function renderCountry(data){
document.querySelector("#loading").style.display="none";
document.querySelector("#country-details").innerHTML=" ";
document.querySelector("#neighbors").innerHTML=" ";
    let html =`


                    <div class="col-4">
                        <img src="${data.flags.png}" class="img-fluid" alt="">
                    </div>
                    <div class="col-8">
                        <h3 class="card-title">${data.name.common}</h3>
                        <hr>
                        <div class="row">
                            <div class="col-6">Population: </div>
                            <div class="col-6">${(data.population/1000000).toFixed(1)} Milyon</div>
                        </div>
                        <div class="row">
                            <div class="col-6">Language: </div>
                            <div class="col-6">${Object.values(data.languages)}</div>
                        </div>
                        <div class="row">
                            <div class="col-6">Capital: </div>
                            <div class="col-6">${data.capital[0]}</div>
                        </div>
                        <div class="row">
                            <div class="col-6">Currency Unit: </div>
                            <div class="col-6">${Object.values(data.currencies)[0].name} (${Object.values(data.currencies)[0].symbol})</div>
                        </div>
                    </div>

    `
    document.querySelector("#details").style.opacity=1;
    document.querySelector("#country-details").innerHTML=html;
                
};

function renderNeighbors(data){


document.querySelector("#neighbors").innerHTML=" ";
for(let country of data){
    
    let html = `
        <div class="col-6 mt-2 col-md-4 col-lg-3 col-xl-2 ">
            <div class="card" onclick='getCountry(this.innerText)'>
                <img src="${country.flags.png}" class="card-img-top">
                <div class="card-body">
                    <h6 class="card-title"> ${country.name.common}</h6>
                </div>
                </div>
            </div>
    `
    document.querySelector("#neighbors").insertAdjacentHTML("beforeend",html);
}
}

function renderError(err){
const html =`
<div class="alert alert-danger">
        ${err.message}
    </div>
`
setTimeout(() => {
    document.querySelector("#errors").innerHTML = "" ;
}, 3000);
document.querySelector("#errors").innerHTML = html ;
document.querySelector("#loading").style.display="none";
}

// Search Box

jQuery.expr[`:`].contains = function(a, i, m) {
    return jQuery(a).text().toUpperCase()
    .indexOf(m[3].toUpperCase()) >= 0;
    };

    $(document).ready( function () {
    
        $("#txtSearch").keyup(function(){
         
        var value = $("#txtSearch").val();
           
        if(value.length==0){
         
        $("#allCountries li").css("display","block");
         
        }else{
         
        $("#allCountries li").hide();
        $("#allCountries li:contains("+value+")").css("display","block");
         
        }
         
        });

        $("#txtSearch").click(function(){
         
            var value = $("#txtSearch").val();
               
            if(value.length==0){
             
            $("#allCountries li").css("display","block");
             
            }else{
             
            $("#allCountries li").hide();
            $("#allCountries li:contains("+value+")").css("display","block");
             
            }
             
            });
         
        });

 document.addEventListener("click", (event) => {
   const isClickInside = document.querySelector(".card-body").contains(event.target);
 
   if (!isClickInside) {
    $("#allCountries li").hide();
   }
 });