//check the browser's current screen size
window.addEventListener('resize', () => {
    const screen_x = window.innerWidth;
    const s_view = document.querySelector(".screen-mobile-view");
    if (screen_x <= 1000) {
        s_view.style.display = "flex";
    }
    else {
        s_view.style.display = "none";
    }
});

const MAIN_DISPLAY = document.querySelector(".page-grid"); // Screen contents after closing the start screen

//Holds the maximum and current game rounds
const rounds = {
    current: 0,
    max: 0,
}

//Get the HTML Objects that holds the text value for Game Rounds
const game_round = document.querySelector('.round');
const game_sub_round = document.querySelector('.sub-round');

//HTML Objects for Rock, Paper, Scissor Picking
const ROCK = document.querySelector(".rock");
const PAPER = document.querySelector(".paper");
const SCISSOR = document.querySelector(".scissor");
const picks = document.querySelectorAll(".pick");

//Containers for the CSS animated arm images
const USER_SIDE = document.querySelector(".user-side");
const AI_SIDE = document.querySelector(".ai-side");

//User Score Values and HTML Objects Score Holder
const AI_SCORE = document.querySelector("#ai-score");
const USER_SCORE = document.querySelector("#user-score");
const scores = {
    user: 0,
    ai: 0,
}

//HTML Image Elements for Arm Images
const user_img = document.querySelector(".user-p");
const ai_img = document.querySelector(".ai-p");

// Possible USER and AI picking
const PICK_ENTRIES = ["rock", "paper", "scissor"];

//Center Game 3 seconds Counter
const pickTimer = document.querySelector(".r-counter");
const waitText = document.querySelector(".picking-text");

//Add events to each 'pick' button
picks.forEach(pick => {
    pick.addEventListener('click', startRound);
})

//Start the match
function startRound(invoker) {

    picks.forEach(pick => {
        pick.classList.add('disabled'); //disabled the rest of the picking once user has chosen his/her pick
    });

    invoker.currentTarget.classList.remove('disabled'); //remove the disabled style values for the pick that user has chosen
    invoker.currentTarget.classList.add('active'); //apply highlighting style to the user's pick

    //set animation arm swing
    USER_SIDE.style.animationName = "user-counting-action";
    AI_SIDE.style.animationName = "ai-counting-action";

    let userPick = invoker.currentTarget.getAttribute('data-pick-type'); // get the 'pick type' of the current invoker
    let count = 3;

    //start the 3 seconds countdown
    let countdown = setInterval(function () {
        waitText.style.display = "none";
        pickTimer.textContent = count;
        if (count != 0) {
            count--;
        }
    }, 1000);

    //Reveal the winner
    setTimeout(function () {

        //hide the timer
        pickTimer.style.display = "none";
        clearInterval(countdown);

        //remove animation arm swing action
        USER_SIDE.style.animationName = "";
        AI_SIDE.style.animationName = "";

        //check who won the current round
        checkWinner(userPick, getAiPick());
    }, 5000);

}


//generate a random number each function execution between 0 to 2
//returns the random generated pick for the AI Side
const getAiPick = () => PICK_ENTRIES[Math.floor(Math.random() * PICK_ENTRIES.length)];


function checkWinner(user, ai) {

    //change the default pick image to user and ai's picking
    user_img.src = `assets/images/picks/user-${user}.png`;
    ai_img.src = `assets/images/picks/ai-${ai}.png`;

    //check if user and ai does not have the same pick
    if (user != ai) {
        if ((user == "rock" && ai == "scissor") || (user == "paper" && ai == "rock") || (user == "scissor" && ai == "paper")) {
            //User Won
            setTimeout(() => {
                okModal("You Won!");
                user_img.src = `assets/images/picks/user-rock.png`;
                ai_img.src = `assets/images/picks/ai-rock.png`;
                scores.user++;
                updateScores();
                resetPick();
                checkScore();
            }, 3000);
        }
        else {

            //AI Won
            setTimeout(() => {
                okModal("AI Won!");
                user_img.src = `assets/images/picks/user-rock.png`;
                ai_img.src = `assets/images/picks/ai-rock.png`;
                scores.ai++;
                updateScores();
                resetPick();
                checkScore();
            }, 3000);

            //player lose
            //add points to ai
        }
    }
    else {

        //Match Draw
        setTimeout(() => {
            okModal("Draw!");
            user_img.src = `assets/images/picks/user-rock.png`;
            ai_img.src = `assets/images/picks/ai-rock.png`;
            picks.forEach(pick => {
                pick.classList.remove('disabled');
                pick.classList.remove('active');
            });
            checkScore();
        }, 3000);
    }
}

function resetPick() {

    //Remove all the 'active' and 'disabled' classnames in the 'pick' element list
    picks.forEach(pick => {
        pick.classList.remove('active');
        pick.classList.remove('disabled');
    });

};

//check whose score is higher or lower
function checkScore() {
    let userScore = document.querySelector(".spu");
    let aiScore = document.querySelector(".spa");

    const { user, ai } = scores;

    if (user > ai) {
        userScore.textContent = "You're ahead!";
        aiScore.textContent = "You're behind!";
    }
    else if (user == ai) {
        userScore.textContent = "Do better!";
        aiScore.textContent = "Do better!";
    }
    else if (user < ai) {
        userScore.textContent = "You're behind!";
        aiScore.textContent = "You're ahead!";
    }
    else {
        userScore.textContent = "Something went wrong!";
        aiScore.textContent = "Something went wrong!";
    }
}

//check the game result based on scores of the players and display a modal with the final result
function checkGameResult() {
    MAIN_DISPLAY.style.display = "none";
    if (scores.user > scores.ai) {
        gameRes.textContent = "You won the game!";
        closeAndDisplay(m_ok, game_result);
    }
    else if (scores.user < scores.ai) {
        gameRes.textContent = "You lose the game!";
        closeAndDisplay(m_ok, game_result);
    }
    else if (scores.user == scores.ai) {
        gameRes.textContent = "Game Draw!";
        closeAndDisplay(m_ok, game_result);
    }
    else {
        gameRes.textContent = "Failed to identify the winner!";
        closeAndDisplay(m_ok, game_result);
        console.log("Error occured while calculating total scores!");
    }
}

//sets and checks the text value of game rounds
function updateRounds() {
    rounds.max = MAIN_DISPLAY.getAttribute('data-round');

    if (rounds.current < rounds.max) {
        rounds.current++;
        game_round.textContent = rounds.current;
        game_sub_round.textContent = rounds.max;
    }
    else if (rounds.current >= rounds.max) {
        checkGameResult();
    }

}

//This is for closing the current display and displaying a new one
function closeAndDisplay(toClose, toOpen) {
    toClose.style.display = "none";
    m_area.style.display = "flex";
    toOpen.style.display = "flex";
}

//sets the current scores
function updateScores() {
    USER_SCORE.textContent = scores.user;
    AI_SCORE.textContent = scores.ai;
}

//resets the scores and rounds set up in previous game
function newGame() {
    rounds.current = 0;
    rounds.max = 0;
    scores.user = 0;
    scores.ai = 0;
}

//Modal Here
const m_area = document.querySelector(".modal-area");

//Modal OK
const m_ok = document.querySelector(".modal-ok");
const ok_btn = document.querySelector(".ok-btn");
const resText = document.querySelector(".modal-ok-result");
const resIcon = document.querySelector(".modal-ok-icon");

ok_btn.addEventListener('click', function () {
    m_area.style.display = "none";
    m_ok.style.display = "none";

    pickTimer.textContent = "";
    let loader = document.createElement("i");
    loader.className = "fa-solid fa-circle-notch fa-spin";
    loader.style.fontSize = "50px";
    waitText.style.display = "block";
    pickTimer.appendChild(loader);

    pickTimer.style.display = "block";
    updateRounds();
});

function okModal(resultText) {
    m_area.style.display = "flex";
    m_ok.style.display = "flex";
    resText.textContent = resultText;
};

//Modal START

const modal_start = document.querySelector('.modal-start');
const modal_start_btn = document.querySelector(".start-game-btn");
const modal_option_btn = document.querySelector(".option-game-btn");

modal_start_btn.addEventListener('click', function () {
    updateScores();
    round_selection.forEach(round => round.checked = false); //reset the round selection
    confirm_round_btn.classList.add("disabled");
    modal_start.style.display = "none";
    modal_rounds.style.display = "flex";
});

//Modal ROUND
const modal_rounds = document.querySelector(".modal-rounds");
const round_selection = document.querySelectorAll("input[name='round-options']");
const confirm_round_btn = document.querySelector(".confirm-rounds-btn");

round_selection.forEach(round => {
    round.addEventListener('change', function () {
        confirm_round_btn.classList.remove('disabled');
    })
});

confirm_round_btn.addEventListener('click', function () {
    m_area.style.display = "none";
    modal_rounds.style.display = "none";
    MAIN_DISPLAY.style.display = "grid";
    let roundSelected = document.querySelector("input[name='round-options']:checked");
    MAIN_DISPLAY.setAttribute('data-round', roundSelected.value);
    updateRounds();
});


//Modal Result

const game_result = document.querySelector(".modal-game-result");
const restart_btn = document.querySelector(".restart-btn");
const exit_btn = document.querySelector(".exit-btn");
const gameRes = document.querySelector("#game-result");

restart_btn.addEventListener('click', () => {
    newGame();
    updateScores();
    game_result.style.display = "none";
    modal_rounds.style.display = "flex";
});

exit_btn.addEventListener('click', () => {
    newGame();
    updateScores();
    game_result.style.display = "none";
    modal_start.style.display = "flex";
});
