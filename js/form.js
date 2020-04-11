const name = document.getElementById('name')
const password = document.getElementById('password')
const form = document.getElementById('form')
const errorMessage = document.getElementById('error')

const gname = document.getElementById("gname");
const cname = document.getElementById("cname");

form.addEventListener('submit', (e) => {
  
  let messages = []

  if (name.value === '' || name.value == null) {
    messages.push('Name is required')
  }

  if (password.value.length <= 6) {
    messages.push('Password must be longer than 6 characters')
  }

  if (password.value.length >= 20) {
    messages.push('Password must be less than 20 characters')
  }

  if (password.value === 'password') {
    messages.push('Password cannot be password')
  }

  if (name.value !== "Jake" && password.value !== "entering") {
    messages.push("Incorrect username or password");
  }

  if (messages.length > 0) {
    e.preventDefault()
    errorMessage.innerText = messages.join(', ')
  }
  
})


function validateForm() {

  if (name.value === "Jake" && password.value === "entering") {
    window.location.href = "./security.html";
  }


}
function validateFormAdmin() {

  if (name.value === "Jake" && password.value === "entering") {
    window.location.href = "./faqadmin.html";
  }


}
function validateFormChild() {

  if (gname.value !== "" || cname.value !== "" || gname.value !== null || cname.value !== null
  ) {
    window.location.href = "./info.html";
  }


}