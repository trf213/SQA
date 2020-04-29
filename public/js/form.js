const name = document.getElementById('name')
const password = document.getElementById('password')
const loginForm = document.getElementById('login-form')
const errorMessage = document.getElementById('error')
const gname = document.getElementById("gname");
const cname = document.getElementById("cname");

loginForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new FormData(loginForm);
  let jsonData = {}

  for (const [key, value] of formData.entries()) {
    jsonData[key] = value;
  }

  fetch(loginForm.action, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jsonData),
    redirect: 'follow'
  })
  .then(res => {
    if (res.redirected) {
      window.location = res.url;
      return;
    }

    res.json()
    .then((json) => {
      if (json.errors) {
        let message = '';
        for (error of json.errors) {
          message += error + '<br>';
        }
        
        errorMessage.innerHTML = message;
      }
    });
  }) 
  
});




