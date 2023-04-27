console.log('Lap trinh Android');
const modalBtn = [...document.getElementsByClassName('modal-button')]
const modalBody = document.getElementById('modal-body-confirm')
const start = document.getElementById('start-button')

modalBtn.forEach(modalbtn => modalbtn.addEventListener('click', ()=>{
     const url = window.location.href;
     const pk = modalbtn.getAttribute('data-pk')
     const name = modalbtn.getAttribute('data-quiz')
     const numQuestion = modalbtn.getAttribute('data-question')
     const difficulty = modalbtn.getAttribute('data-difficulty')
     const scoretopass = modalbtn.getAttribute('data-pass')
     const time = modalbtn.getAttribute('data-time')

     modalBody.innerHTML=`
        <div class="h5 mb-3">Are you sure you want to begin "<b>${name}</b>" ?</div>
        <div class="text-muted">
            <ul>
                <li>Difficulty: <b>${difficulty}</b></li>
                <li>Number of questions: <b>${numQuestion}</b></li>
                <li>Score to pass: <b>${scoretopass}%</b></li>
                <li>Time: <b>${time} min</b></li>
            </ul>

        </div>
     `;

     start.addEventListener('click', ()=>{
        window.location.href = url+pk;
     });
}));