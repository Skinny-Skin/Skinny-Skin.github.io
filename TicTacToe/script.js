let idnty = document.querySelector("#identifier");
let rset = document.querySelector(".rset");
let announce = document.querySelector(".hide1");
let rnew = document.querySelector(".hide");
let mpadding = document.querySelector(".BigBox");
let butns = document.querySelectorAll(".box");

const winningP = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

let movet = "X";

rset.addEventListener("mouseover",()=>{
    rset.classList.remove("rset");
    rset.classList.add("hrset");
});
rset.addEventListener("mouseout",()=>{
    rset.classList.remove("hrset");
    rset.classList.add("rset");
});
rnew.addEventListener("mouseover",()=>{
    rnew.classList.remove("rset");
    rnew.classList.add("hrset");
});
rnew.addEventListener("mouseout",()=>{
    rnew.classList.remove("hrset");
    rnew.classList.add("rset");
});


function m_event(e) {
    e.target.classList.remove("box");
    e.target.classList.add("hbox");
}
function mo_event(e) {
    e.target.classList.remove("hbox");
    e.target.classList.add("box");
}

function handleClickWrapper(button) {
    function handleClick() {
        if (button.innerText !== "") return;

        button.innerText = movet;
        button.disabled = true;

        button.removeEventListener("click", handleClick);
        button.removeEventListener("mouseover", m_event);
        

        movet = movet === "X" ? "O" : "X";
        idnty.innerHTML = `<i>Next Move: ${movet}</i>`;

        let win = winner();
        if (win !== "") {
            idnty.innerHTML = "";
            announce.classList.remove("hide1");
            announce.classList.add("announce");

            if (win === "Draw") {
                announce.innerHTML = "It is a DEAD DRAW :(";
            } else {
                announce.innerHTML = `Congratulations! Winner is ${win} <h3><i> scroll down </i> </h3>`;
            }

            rset.classList.remove("rset");
            rset.classList.add("hide");
            rnew.classList.remove("hide");
            rnew.classList.add("rset");
            mpadding.classList.remove("BigBox");
            mpadding.classList.add("BeegBox");
        }

        check();
    }

    return handleClick;
}

butns.forEach((button) => {
    button.disabled = false;
    button.addEventListener("mouseover", m_event);
    button.addEventListener("mouseout", mo_event);
    button.addEventListener("click", handleClickWrapper(button));
});

function resetGame() {
    butns.forEach((button) => {
        button.innerText = "";
        button.disabled = false;
        button.classList.remove("winbox");

        button.addEventListener("mouseover", m_event);
        button.addEventListener("mouseout", mo_event);
        button.addEventListener("click", handleClickWrapper(button));
    });

    movet = "X";
    idnty.innerHTML = "<i>Default: X plays first</i>";
    announce.classList.remove("announce");
    announce.classList.add("hide1");
    mpadding.classList.remove("BeegBox");
    mpadding.classList.add("BigBox");
}

rset.addEventListener("click", () => {
    resetGame();
});

rnew.addEventListener("click", () => {
    resetGame();
    rnew.classList.remove("rset");
    rnew.classList.add("hide");
    rset.classList.remove("hide");
    rset.classList.add("rset");
});

function winner() {
    for (let win of winningP) {
        let [a, b, c] = win;
        if (butns[a].innerText !== "" && butns[a].innerText === butns[b].innerText &&
            butns[b].innerText === butns[c].innerText
        ) {
            butns[a].classList.add("winbox");
            butns[b].classList.add("winbox");
            butns[c].classList.add("winbox");
            return butns[a].innerText;
        }
    }

    let isDraw = true;
    for (let box of butns) {
        if (box.innerText === "") {
            isDraw = false;
            break;
        }
    }

    if (isDraw) return "Draw";

    return "";
}

function check() {
    let win = winner();
    if (win !== "" && win !== "Draw") {
        for (let box of butns) {
            box.disabled = true;
        }
    }
}
