const feedback = document.querySelector('#feedback');
const dataScript = document.querySelector('#data');
const data = JSON.parse(dataScript.textContent);

feedback.innerHTML += '<p>RUNNING SCRIPT</p>';
feedback.innerHTML += `<p>There are ${data.length} newsletters</p>`;
