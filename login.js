
document.getElementById("loginBtn").addEventListener("click", function () {

const userName = document.getElementById("userName").value;
const password = document.getElementById("password").value;

if (userName === "admin" && password === "admin123") {

window.location.href = "main.html";

} else {

alert("Wrong username or password");

}

});