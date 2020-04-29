const url = '/faq/select';
const windowUrl = window.location.toString();

fetch(url)
.then(response => response.json())
.then(function(data) {
  console.log(data.faq[0]);
  for(var i = 0; i < data.faq.length; i++)
  {
    let accordion =  document.getElementById('accordion');
    let col = document.createElement('div').setAttribute('id','col-sm-12');
    let row = document.createElement('div').setAttribute('id','row');
    let container = document.createElement('div').setAttribute('id','container');

    if (windowUrl.includes('/faq/guest')) {
      accordion.innerHTML += 
        `<div class="panel initial-line">
            <div class="line-header p-3 mb-3" role="tab" id="line2">
                <h3 class="line-name">
                    <a class="collapsed text-dark" role="button" title="" data-toggle="collapse" data-parent="#accordion"
                        href="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                        ${data.faq[i]['ques']}
                    </a>
                </h3>
            </div>
            <div id="collapse${i}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="line2">
                <div class="panel-body px-3 mb-4">
                    <p>${data.faq[i]['answer']}
                </div>
            </div>
        </div>`;
    } else if (windowUrl.includes('/faq/admin')) {
      accordion.innerHTML += 
        `<div class="panel initial-line">
            <div class="line-header p-3 mb-3" role="tab" id="line2">
                <h3 class="line-name">
                    <a class="collapsed text-dark" role="button" title="" data-toggle="collapse" data-parent="#accordion"
                        href="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                        ${data.faq[i]['ques']}
                    </a>
                </h3>
            </div>
            <div id="collapse${i}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="line2">
                <div class="panel-body px-3 mb-4">
                    <p>${data.faq[i]['answer']}
                    <br> ${data.faq_log[i]['action']}: ${data.faq_log[i]['timestamp']}
                    </p>
                    <button id="faq-edit=${i}" class="btn btn-link btn-faq-edit" type="button">Edit</button>
                </div>
            </div>
        </div>`;
      }
  }
})
.catch(function(error) {
  console.error(error);
});