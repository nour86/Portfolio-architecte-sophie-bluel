// VARIABLES
// let projects = null
let projects = window.localStorage.getItem("projects")
if (projects === null) {
  // Récupération des pièces depuis l'API
  const response = await fetch("http://localhost:5678/api/works/")
  projects = await response.json()
  const listOfProjects = JSON.stringify(projects) // Transformation des pièces en JSON
  window.localStorage.setItem("projects", listOfProjects) // Stockage des informations dans le localStorage
} else {
  projects = JSON.parse(projects)
}
let token = window.localStorage.getItem("token") // récupération du mot de passe

const categories = [
  ...new Set(projects.map((project) => project.category.name)),
] // récupère les noms des catégories de chaque projet, puis supprime les doublons
categories.unshift("Tous") // ajoute la catégorie "Tous en début d'array

// VISITOR MODE //
const gallery = document.querySelector(".gallery")

function displayProjects(projects) {
  // affiche les projets dans la Galerie principale

  for (const project of projects) {
    const projectElement = document.createElement("figure")
    projectElement.dataset.id = project.id
    projectElement.dataset.categoryId = project.categoryId
    // Création des balises
    const imageElement = document.createElement("img")
    imageElement.src = project.imageUrl
    imageElement.alt = project.title
    const nomElement = document.createElement("figcaption")
    nomElement.innerText = project.title

    // On rattache la balise figure a la section gallery
    gallery.appendChild(projectElement)
    projectElement.appendChild(imageElement)
    projectElement.appendChild(nomElement)
  }
}
function displayFilters() {
  // affiche les filtres
  const filtersBar = document.querySelector(".filters")
  for (let i = 0; i < categories.length; i++) {
    const filter = categories[i]

    const filterButton = document.createElement("button") // crée autant de bouttons qu'il y a d'éléments dans le tableau category
    filterButton.innerText = filter
    filterButton.dataset.categoryValue = i // ajoute une data-category-value pour pouvoir filter les projets portant le même id de category
    filterButton.addEventListener("click", (event) => {
      filterProjects(filterButton.dataset.categoryValue)
    })
    filtersBar.appendChild(filterButton)
  }
  const defaultFilterButton = filtersBar.querySelector(
    '[data-category-value="0"]'
  )
  defaultFilterButton.setAttribute("class", "activated") // initialise le Filtre sur "Tous".
}
function filterProjects(activeCategory) {
  // filtre les projets et modifie le style des filtres

  // si la categoryValue du boutton correspond à la categorie filtrée, le boutton est activé
  const filters = document.querySelectorAll(".filters button")
  filters.forEach((button) => {
    button.dataset.categoryValue == activeCategory
      ? button.setAttribute("class", "activated")
      : button.removeAttribute("class")
  })

  const displayedProjects = gallery.children
  // pour chaque projet, si sa catégorie ne correspond pas à la catégorie filtrée, il est masqué.
  for (const project of displayedProjects) {
    if (project.dataset.categoryId == activeCategory || activeCategory == 0) {
      project.removeAttribute("class", "js-hidden")
    } else {
      project.setAttribute("class", "js-hidden")
    }
  }
}

// ADMIN MODE //

const logOutButton = document.querySelector("li.js-logout") // boutton logout
const editorElements = document.querySelectorAll(".js-logged-in")
logOutButton.addEventListener("click", logOut)

function isUserLoggedIn() {
  // boolean à l'ouverture de la page, si l'utilisateur est admin => interface admin
  if (window.localStorage.hasOwnProperty("token")) {
    toggleUserView() // passe directement en mode admin
  }
}
function toggleUserView() {
  // passer de l'interface visiteur à l'inteface Admin.
  for (const element of editorElements) {
    element.classList.toggle("js-hidden")
  }
}
function logOut() {
  token = ""
  window.localStorage.removeItem("token")
  toggleUserView()
}

// MODAL //

const modal = document.querySelector("#modal")
const modalWrapper = document.querySelector(".modal-wrapper")
const openModalButton = document.querySelector("#js-modal")
const closeModalButton = modalWrapper.querySelector(".js-modal-close")
const modalGallery = modalWrapper.querySelector(".modal-gallery")

openModalButton.addEventListener("click", () => modal.showModal())
modal.addEventListener("click", () => modal.close())
closeModalButton.addEventListener("click", () => modal.close())
modalWrapper.addEventListener("click", (event) => event.stopPropagation())

//open and close modal//

// let modal = null

// const openModal = function (e) {
//   modal = document.querySelector("#main_modal")
//   modal.classList.remove("js-hidden")
//   modalWrapper.classList.remove("js-hidden")
//   modal.setAttribute("aria-hidden", "false")
//   modal.setAttribute("aria-modal", "true")
//   modal.addEventListener("click", closeModal)
//   modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
//   modal
//     .querySelector(".js-modal-stop")
//     .addEventListener("click", stopPropagation)
// }
// const closeModal = function (e) {
//   if (modal === null) return
//   e.preventDefault()
//   window.setTimeout(function () {
//     modal.classList.add("js-hidden")
//     modalWrapper.classList.add("js-hidden")
//     modal = null
//   }, 300)
//   modal.setAttribute("aria-hidden", "true")
//   modal.removeAttribute("aria-modal")
//   modal.removeEventListener("click", closeModal)
//   modal
//     .querySelector(".js-modal-close")
//     .removeEventListener("click", closeModal)
//   modal
//     .querySelector(".js-modal-stop")
//     .removeEventListener("click", stopPropagation)
// }
// const stopPropagation = function (e) {
//   e.stopPropagation()
// }

// document.querySelectorAll(".js-modal").forEach((a) => {
//   a.addEventListener("click", openModal)
// })

// window.addEventListener("keydown", function (e) {
//   if (e.key === "Escape" || e.key === "Esc") {
//     closeModal(e)
//   }
// })

// display projects in modal //

export function displayModalGallery(listofProjects) {
  for (const project of listofProjects) {
    const figure = document.createElement("figure")
    figure.dataset.id = project.id
    const img = document.createElement("img")
    img.setAttribute("src", project.imageUrl)
    img.setAttribute("alt", project.title)
    figure.appendChild(img)
    const trash = document.createElement("i")
    trash.setAttribute("class", "js-trash fa-solid fa-trash-can fa-sm")
    trash.dataset.id = project.id
    figure.appendChild(trash)
    modalGallery.appendChild(figure)
    trash.addEventListener("click", function (e) {
      e.preventDefault()
      displayDeletePrompt(project)
    })
  }
}

export function displayModalUploadCategories(listofCategories) {
  const selectCategory = modalWrapper.querySelector("#image_category")
  for (let i = 1; i < listofCategories.length; i++) {
    const option = document.createElement("option")
    option.setAttribute("value", i)
    option.innerText = listofCategories[i]
    selectCategory.appendChild(option)
  }
}

// navigate in modal //

const modalPages = modalWrapper.querySelectorAll(".modal-content")
const addPictureButton = modalWrapper.querySelector(".js-add-picture")
const navigateBack = modalWrapper.querySelector(".modal-navbar .fa-arrow-left")

addPictureButton.addEventListener("click", function goToModalUpload() {
  if (!deletePrompt.classList.contains("js-hidden")) {
    deletePrompt.classList.add("js-hidden") // si le prompt est visible au moment du changement de page, on le cache
  }
  changeModalPage()
})
navigateBack.addEventListener("click", function goToModalGallery() {
  changeModalPage()
})

function changeModalPage() {
  for (const page of modalPages) {
    page.classList.toggle("js-hidden")
  }
  navigateBack.classList.toggle("js-hidden")
}

// DELETE PROJECT FUNCTION

const deletePrompt = modalWrapper.querySelector(".delete-project-prompt")
const deleteMessage = modalWrapper.querySelector(".delete-project-message")
const deleteOk = deletePrompt.querySelector(".js-confirm")
const deleteCancel = deletePrompt.querySelector(".js-cancel")

deleteOk.addEventListener("click", function confirmDelete(e) {
  e.preventDefault()
  deletePrompt.classList.add("js-hidden")
  deleteProject(this.dataset.projectId)
})

deleteCancel.addEventListener("click", function cancelDelete(e) {
  e.preventDefault()
  deletePrompt.classList.add("js-hidden")
})

export function displayDeletePrompt(project) {
  if (deletePrompt.classList.contains("js-hidden")) {
    // si le prompt est visible, il le reste et le message est modifié.
    deletePrompt.classList.remove("js-hidden")
  }
  deletePrompt.querySelector("h4 strong").innerText = `${project.title}`
  deleteOk.dataset.projectId = project.id // passe le project.id au boutton qui trigger la suppression.
}

export const deleteProject = async function (projectId) {
  deleteMessage.classList.remove("js-hidden")
  try {
    const response = await fetch(
      `http://localhost:5678/api/works/${projectId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (response.ok) {
      deleteMessage.innerText = "projet supprimé"
      // suppression dans le html de la page

      const allRefsToProject = document.querySelectorAll(
        `[data-id="${projectId}"]`
      )
      for (const ref of allRefsToProject) {
        ref.remove()
      }
      // suppression dans la liste des projets
      const index = (element) => element.id == projectId
      const position = projects.findIndex(index) //trouve son index dans le tableau projects
      projects.splice(position, 1)
      const newListOfProjects = JSON.stringify(projects)

      // Stockage des informations dans le localStorage
      window.localStorage.setItem("projects", newListOfProjects)
    } else if (response.status == 401) {
      deleteMessage.innerText = "autorisations insuffisantes"
    } else if (response.status == 500) {
      deleteMessage.innerText = "une erreur inattendue s'est produite"
    }
  } catch (error) {
    deleteMessage.innerText = "une erreur inattendue s'est produite"
    console.log(error.response)
  }
  setTimeout(() => {
    deleteMessage.innerText = ""
    deleteMessage.classList.add("js-hidden")
  }, 2000)
}

// ADD PROJECT FUNCTION //

const dropImageArea = modalWrapper.querySelector("#drop_image_area")
const imageInput = modalWrapper.querySelector("#image_upload")
const imagePreview = modalWrapper.querySelector(".image-preview")
const imageMessage = modalWrapper.querySelector(".info-image")
const imageTitle = modalWrapper.querySelector("#image_title")
const imageCategory = modalWrapper.querySelector("#image_category")
const uploadMessage = modalWrapper.querySelector(".upload-project-message")
const uploadButton = modalWrapper.querySelector("#upload_button")
const imageCategoryId = modalWrapper.querySelector("#image_category")
const imageError = modalWrapper.querySelector(".image-error")
const imageErrorMessage = imageError.querySelector(".image-error-message p")

//drag and drop event listener

imageError.addEventListener("click", function toggleImageErrorView() {
  imageError.classList.toggle("js-hidden")
  CleanUploadFields()
})
dropImageArea.addEventListener("drop", function (e) {
  e.preventDefault()
  if (e.dataTransfer.items.length > 1) {
    imageErrorMessage.innerText = "merci de ne déposer qu'un fichier à la fois!"
    imageError.classList.toggle("js-hidden")
    setTimeout(() => {
      dropImageArea.classList.remove("dragover")
    }, 2000)
  } else {
    imageInput.files = e.dataTransfer.files
    displayImagePreview()
  }
  dropImageArea.classList.remove("dragover")
})
dropImageArea.addEventListener("dragover", function (e) {
  e.preventDefault()
  dropImageArea.classList.add("dragover")
})
dropImageArea.addEventListener("dragleave", function (e) {
  e.preventDefault()
  dropImageArea.classList.remove("dragover")
})

imageInput.addEventListener("change", displayImagePreview)

// display image preview

function displayImagePreview() {
  while (imagePreview.childElementCount > 1) {
    // on vide tous les enfants à l'exception du 1er (icone pour fermer)
    imagePreview.removeChild(imagePreview.lastChild)
  }
  const curFile = imageInput.files[0]
  const fileTypes = ["image/jpeg", "image/png"]

  if (curFile.length === 0) {
    imageMessage.textContent = "jpg - png : 4Mo max"
  } else {
    if (!fileTypes.includes(curFile.type)) {
      imageErrorMessage.innerText = " type de fichier non pris en compte"
      imageError.classList.toggle("js-hidden")
    } else {
      if (curFile.size > 4 * 1024 * 1024) {
        imageErrorMessage.innerText = `taille > 4 Mo`
        imageError.classList.toggle("js-hidden")
      } else {
        //instructions si toutes les conditions sont ok
        const image = document.createElement("img")
        image.src = URL.createObjectURL(curFile)
        const title = curFile.name.split(".") // split le nom de l'image au niveau du "."
        imageTitle.value = title[0] // première partie du nom de l'image
        imagePreview.appendChild(image)
        // imagePreview.appendChild(imagecaption)
        imagePreview.classList.remove("js-hidden")
      }
    }
  }
}

// check if form is ready to be sent
document
  .querySelector(".modal-upload-form")
  .addEventListener("submit", (e) => e.preventDefault())

document
  .querySelector(".modal-upload-form")
  .addEventListener("change", function formatSubmitButton() {
    isUploadFormValid()
      ? (uploadButton.disabled = false)
      : (uploadButton.disabled = true)
  })

function isUploadFormValid() {
  if (
    document.querySelector(".image-preview img") &&
    imageTitle.value.match(/^\S.+$/) &&
    imageCategory.value != ""
  ) {
    return true
  } else return false
}

//add project
uploadButton.addEventListener("click", async function addProject(e) {
  e.preventDefault()
  uploadMessage.classList.remove("js-hidden")
  let formData = new FormData()
  formData.append("image", imageInput.files[0])
  formData.append("title", imageTitle.value)
  formData.append("category", imageCategoryId.value)

  try {
    // requête pour envoyer la nouvelle image
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
    if (response.ok) {
      let newProject = await response.json()

      //formatage de la réponse du serveur//
      newProject.categoryId = parseInt(newProject.categoryId)
      newProject.category = {
        id: newProject.categoryId,
        name: categories[newProject.categoryId],
      }
      // Ajout au local storage
      projects.push(newProject)
      const newListOfProjects = JSON.stringify(projects)
      window.localStorage.setItem("projects", newListOfProjects)

      // Ajout dans la gallerie principale
      displayProjects([newProject])

      // Ajout dans la gallerie modal
      displayModalGallery([newProject])

      //message de confirmation//
      uploadMessage.innerText = `${newProject.title} ajouté à la 
      catégorie "${newProject.category.name}" avec l'id :${newProject.id}`
    } else {
      uploadMessage.innerText = "Échec de l'envoi de l'image"
    }
  } catch (error) {
    uploadMessage.innerText = "Une erreur inattendue s'est produite"
    console.log(error)
  }
  setTimeout(() => {
    uploadMessage.innerText = ""
    uploadMessage.classList.add("js-hidden")
    CleanUploadFields() // vide les champs du formulaire après 2sec
  }, 2000)
})

// clean modalupload

export function CleanUploadFields() {
  while (imagePreview.childElementCount > 1) {
    //supprime le contenu de la div imagepreview
    imagePreview.removeChild(imagePreview.lastChild)
  }
  if (!imagePreview.classList.contains("js-hidden")) {
    imagePreview.classList.add("js-hidden") //cache imagePreview si elle est visible
  }
  imageInput.value = "" // supprime le fichier du boutton "file";
  imageTitle.value = "" //vide les champs
  imageCategory.value = "" //vide les champs
  uploadMessage.innerText = "" // vide les champs
  uploadButton.disabled = true // désactive le boutton envoyer
}

imagePreview.addEventListener("click", function closeImagePreview() {
  CleanUploadFields()
})

// initialisation

displayProjects(projects)
displayFilters()
isUserLoggedIn()
displayModalGallery(projects)
displayModalUploadCategories(categories)
