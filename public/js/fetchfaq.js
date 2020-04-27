const url = '/faq/select';

fetch(url)
.then(response => response.json())
.then(function(data) {
  console.log(data[0]);
  for(var i = 0; i < data.length; i++)
  {
    let accordion =  document.getElementById('accordion');
    let col = document.createElement('div').setAttribute('id','col-sm-12');
    let row = document.createElement('div').setAttribute('id','row');
    let container = document.createElement('div').setAttribute('id','container');
    accordion.innerHTML += 
    `<div class="panel initial-line">
        <div class="line-header p-3 mb-3" role="tab" id="line2">
            <h3 class="line-name">
                <a class="collapsed text-dark" role="button" title="" data-toggle="collapse" data-parent="#accordion"
                    href="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                    ${data[i]['ques']}
                </a>
            </h3>
        </div>
        <div id="collapse${i}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="line2">
            <div class="panel-body px-3 mb-4">
                <p>${data[i]['answer']}</p>
            </div>
        </div>
    </div>`;
  }
})
.catch(function(error) {
  console.log(error);
});