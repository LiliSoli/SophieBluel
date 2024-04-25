const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const emailValue = document.getElementById("email").value;
  const passwordValue = document.getElementById("password").value;

  const userData = JSON.stringify({
    email: emailValue,
    password: passwordValue,
  });

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: userData,
  })
    .then((response) => {
      if (!response.ok) {
        alert("Email ou mot de passe incorrect");
        return
      }
      return response.json();
    })

    .then((user) => {

      const tokenValue = user.token;
      window.localStorage.setItem("token", tokenValue);

      window.location.href = "./index.html";
    });
});
