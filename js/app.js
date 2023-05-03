const phonesContainer = document.getElementById("phones-container");
const showAll = document.getElementById("show-all");
const noPhone = document.getElementById("no-found-message");
const loaderSection = document.getElementById("loader");
const searchField = document.getElementById("search-field");
const searchForm = document.getElementById("search-form");

const loadPhones = async (searchText) => {
  searchText = searchText.toLowerCase();

  const url = `https://openapi.programming-hero.com/api/phones?search=${searchText}`;
  const res = await fetch(url);
  const data = await res.json();

  showAll.onclick = () => {
    showAll.classList.add("d-none");
    displayPhones(data.data);
  };

  if (data.data.length > 10) {
    showAll.classList.remove("d-none");
  } else {
    showAll.classList.add("d-none");
  }

  if (data.data.length === 0) {
    noPhone.classList.remove("d-none");
  } else {
    noPhone.classList.add("d-none");
  }

  displayPhones(
    searchText === "iphone" ? [data.data[0]] : data.data.slice(0, 10)
  );
};

const displayPhones = (phones) => {
  phonesContainer.innerHTML = "";
  // display all phones
  phones.forEach((phone) => {
    const phoneDiv = document.createElement("div");
    phoneDiv.classList.add("col");
    phoneDiv.innerHTML = `
        <div class="card p-4">
            <img src="${phone?.image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${phone?.phone_name}</h5>
                <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                <button onclick="loadPhoneDetails('${phone?.slug}')" href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#phoneDetailModal">Show Details</button>
                
            </div>
        </div>
        `;
    phonesContainer.appendChild(phoneDiv);
  });
  // stop spinner or loader
  toggleSpinner(false);
};

searchForm.onsubmit = (e) => {
  e.preventDefault();

  toggleSpinner(true);
  const searchText = searchField.value;
  loadPhones(searchText);

  searchForm.reset();
};

const toggleSpinner = (isLoading) => {
  if (isLoading) {
    loaderSection.classList.remove("d-none");
  } else {
    loaderSection.classList.add("d-none");
  }
};

const loadPhoneDetails = async (id) => {
  const url = ` https://openapi.programming-hero.com/api/phone/${id} `;
  const res = await fetch(url);
  const data = await res.json();
  displayPhoneDetails(data.data);
};

const displayPhoneDetails = (phone) => {
  console.log(phone);
  const modalTitle = document.getElementById("phoneDetailModalLabel");
  modalTitle.innerHTML = `${phone.name}`;
  const phoneDetails = document.getElementById("phone-details");
  console.log(phone.mainFeatures.sensors[0]);
  phoneDetails.innerHTML = `
    <div class="text-dark text-center">
    <img src="${phone.image}" alt="">
    <p>Release Date: ${phone.releaseDate}</p>
    <p>Storage: ${phone.mainFeatures.storage}</p>
    <p>Others: ${phone.mainFeatures.chipSet}</p>
    <p>Sensor: ${phone.mainFeatures.sensors[0]}</p>
</div>
    `;
};

loadPhones("apple");
