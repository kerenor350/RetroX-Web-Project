function goToMyList() {
    window.location.href = "/main#my-list-section";
}

document.addEventListener("DOMContentLoaded", () => {

    const profileImage = localStorage.getItem("selectedPersonaImage");
    const profileEl = document.querySelector(".navbar .profile-img");

    if (profileImage && profileEl) {
        profileEl.src = profileImage.startsWith("/")
            ? profileImage
            : `/${profileImage}`;
    }

});
