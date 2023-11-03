const form = document.querySelector("#login form")
const loginMessage = document.querySelector(".login-message")

form.addEventListener("submit", async (event) => {
  event.preventDefault()

  const userinfos = {
    email: event.target.querySelector("[name=email]").value,
    password: event.target.querySelector("[name=password]").value,
  }

  const payLoad = JSON.stringify(userinfos)

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: payLoad,
    })

    if (response.ok) {
      const result = await response.json()

      window.localStorage.setItem("token", result.token)
      loginMessage.classList.add("info__success")
      loginMessage.innerText = "Utilisateur connecté"
      console.log(window.localStorage)
      setTimeout(() => {
        window.location = "index.html"
      }, 500)
    } else if (response.status == 404) {
      loginMessage.classList.add("info__error")
      loginMessage.innerText = "Utilisateur inconnu"
      setTimeout(() => {
        loginMessage.innerText = ""
      }, 1000)
    } else if (response.status == 401) {
      loginMessage.classList.add("info__error")
      loginMessage.innerText = "Mot de passe incorrect"
      setTimeout(() => {
        loginMessage.innerText = ""
      }, 1000)
    }
  } catch (error) {
    console.log(error.response)
  }
})
