//clear cache
window.addEventListener('beforeunload', function () {
    if (performance.navigation.type === 1) {
        // This is a page reload, clear the cache.
        window.location.reload(true);
    }
});


const items = document.querySelectorAll('.accordion button');

function toggleAccordion() {
    const itemToggle = this.getAttribute('aria-expanded');

    for (i = 0; i < items.length; i++) {
        items[i].setAttribute('aria-expanded', 'false');
    }

    if (itemToggle == 'false') {
        this.setAttribute('aria-expanded', 'true');
    }
}

items.forEach((item) => item.addEventListener('click', toggleAccordion));


const app = document.getElementById("download-app");
app.addEventListener("click", function () {
    redirectToURL("launchsoon.html");
})

const app1 = document.getElementById("download-app2");
app1.addEventListener("click", function () {
    redirectToURL("launchsoon.html");
})




const modal = document.getElementById("myModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const bookMaidBtn = document.getElementById("bookMaidBtn");
const bookCookBtn = document.getElementById("bookCookBtn");
const bookNannyBtn = document.getElementById("bookNannyBtn");

// Function to open the modal
function openModal() {
    modal.style.display = "block";
}

// Function to close the modal
function closeModal() {
    modal.style.display = "none";
}

// Function to redirect to a URL
function redirectToURL(url) {
    window.location.href = url;
}

// Event listeners
openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
bookMaidBtn.addEventListener("click", () => {
    redirectToURL("bm.html");
});
bookCookBtn.addEventListener("click", () => {
    redirectToURL("bc.html");
});
bookNannyBtn.addEventListener("click", () => {
    redirectToURL("bn.html");
});

// Close the modal if the user clicks outside of it
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

/////

const modal2 = document.getElementById("myModal2");
const openModalBtn2 = document.getElementById("openModalBtn2");
const closeModalBtn2 = document.getElementById("closeModalBtn2");
const bookMaidBtn2 = document.getElementById("bookMaidBtn2");
const bookCookBtn2 = document.getElementById("bookCookBtn2");
const bookNannyBtn2 = document.getElementById("bookNannyBtn2");

// Function to open the modal
function openModal2() {
    modal2.style.display = "block";
}

// Function to close the modal
function closeModal2() {
    modal2.style.display = "none";
}

// Function to redirect to a URL
function redirectToURL(url) {
    window.location.href = url;
}

// Event listeners
openModalBtn2.addEventListener("click", openModal2);
closeModalBtn2.addEventListener("click", closeModal2);
bookMaidBtn2.addEventListener("click", () => {
    redirectToURL("bm.html");
});
bookCookBtn2.addEventListener("click", () => {
    redirectToURL("bc.html");
});
bookNannyBtn2.addEventListener("click", () => {
    redirectToURL("bn.html");
});

// Close the modal if the user clicks outside of it
window.addEventListener("click", (event) => {
    if (event.target === modal2) {
        closeModal2();
    }
});





///"openModalBtn1"

const modal1 = document.getElementById("myModal1");
const openModalBtn1 = document.getElementById("openModalBtn1");
const closeModalBtn1 = document.getElementById("closeModalBtn1");
const bookMaidBtn1 = document.getElementById("bookMaidBtn1");
const bookCookBtn1 = document.getElementById("bookCookBtn1");
const bookNannyBtn1 = document.getElementById("bookNannyBtn1");

function openModal1() {
    modal1.style.display = "block";
}

// Function to close the modal
function closeModal1() {
    modal1.style.display = "none";
}

// Function to redirect to a URL
function redirectToURL(url) {
    window.location.href = url;
}


openModalBtn1.addEventListener("click", () => {
    redirectToURL("registerworker.html");
});










