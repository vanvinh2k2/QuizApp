const url = window.location.href;
quizBox = document.getElementById('quiz-box');
const resultbox = document.getElementById('result-box');
const scorebox = document.getElementById('score-box');
const timeBox = document.getElementById('time-box');
let timer;

const activeTime = (time)=>{
    if(time.toString().lenght < 2){
        timeBox.innerHTML = `<b>0${time}:00</b>`;
    }else{
        timeBox.innerHTML = `<b>${time}:00</b>`;
    }

    let minutes = time - 1;
    let second = 60;
    let displayMinutes
    let displaySeconds

    timer = setInterval(()=>{
        second--;
        if(second<0){
            second = 59;
            minutes--;
        }
        if(minutes.toString().length<2){
            displayMinutes = '0'+minutes;

        }else{
            displayMinutes = minutes
        }
        if(second.toString().length<2){
            displaySeconds = '0'+second;
        }
        else{
            displaySeconds = second;
        }
        if(minutes ===0 && second === 0){
            timeBox.innerHTML = `<b>$00:00</b>`
            setTimeout(()=>{
                clearInterval(timer);
                alert('time over');
                sendData();
            },500);
            
        }
        timeBox.innerHTML = `<b>${displayMinutes}:${displaySeconds}</b>`;
    },1000)
}

$.ajax({
    type: 'GET',
    url: `${url}data`,
    success: function(reponse){
        console.log(reponse);
        const data = reponse.data
        data.forEach(el => {
            for(const [questions, answers] of Object.entries(el)){
                quizBox.innerHTML += `
                    <hr>
                    <div class="mb-2">
                        <b>${questions}</b>
                    </div>
                `;
                answers.forEach(answer=>{
                    quizBox.innerHTML += `
                        <div class="mb-2">
                            <input type="radio" class="ans" id="${questions}-${answer}" name="${questions}" value="${answer}">
                            <lable for="${questions}">${answer}</lable>
                        </div>
                `;

                })
            }
        });
        activeTime(reponse.time);
    },
    error: function(error){
        console.log(error);
    }
})

const quizForm  = document.getElementById('quiz-form');
const csrf = document.getElementsByName('csrfmiddlewaretoken');

const sendData = function (){
    const data = {}
    const elements = [...document.getElementsByClassName('ans')];
    data['csrfmiddlewaretoken'] = csrf[0].value;
    elements.forEach(el=>{
        if(el.checked){
            data[el.name] = el.value
        }else{
            if(!data[el.name]){
                data[el.name] = null;
            }
        }
    })

    $.ajax({
        type: 'POST',
        url: `${url}save/`,
        data: data,
        success : function(response){
            results = response.results;
            quizForm.classList.add('in-visible');

            scorebox.innerHTML = `${response.passed ? "Pass":"Fail..:("} Your result is ${response.score.toFixed(2)}%`;
            results.forEach(res=>{
                const resDiv = document.createElement('div')
                for(const [question, answer] of Object.entries(res)){
                    resDiv.innerHTML += question;
                    const cls = ['container', 'p-3', 'text-light', 'h6']
                    resDiv.classList.add(...cls);

                    if(answer=='not answered'){
                        resDiv.innerHTML += '- not answered';
                        res.classList.add('bg-danger');
                    }else{
                        const ans = answer['answered'];
                        const correct = answer['correct_answer'];
                        //console.log(ans,correct);
                        if(ans == correct){
                            resDiv.classList.add('bg-success')
                            resDiv.innerHTML += ` answered: ${ans}`;
                        }else{
                            resDiv.classList.add('bg-danger')
                            resDiv.innerHTML += ` | correct answered: ${correct}`;
                            resDiv.innerHTML += ` | answered: ${ans}`;
                        }
                    }

                }
                //const body = document.getElementsByTagName('BODY')[0]
                resultbox.append(resDiv);
            })
        },
        error: function(error){
            console.log(error);
        }
    })
}

quizForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    clearInterval(timer);
    sendData();
});