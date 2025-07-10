let idnty = document.querySelector("#identifier");
let rset = document.querySelector(".rset");
let announce = document.querySelector(".hide1");
let rnew = document.querySelector(".hide");
let mpadding = document.querySelector(".BigBox");
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
let butns = document.querySelectorAll(".box");
const winningP = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
let movet = "X";
butns.forEach((button) => {
    button.disabled = false;
    let m_event =  () => {
            button.classList.remove("box");
            button.classList.add("hbox");
    };
    let mo_event = () => {
            button.classList.remove("hbox");
            button.classList.add("box");
    };

    button.addEventListener("mouseover", m_event);
    button.addEventListener("mouseout", mo_event);

    button.addEventListener("click",() => {
        if(movet==="X"){
            button.innerText = movet;
            movet = "O";
            button.disabled = true;
            idnty.innerHTML = "<i>Next Move: O</i>";
            button.removeEventListener("mouseover", m_event);
            winner();
            if(winner()!=""){
                idnty.innerHTML = "";
                announce.classList.remove("hide1");
                announce.classList.add("announce");
                announce.innerHTML = `Congratulations! Winner is ${winner()} <h3><i> scroll down </i> </h3>`
                rset.classList.remove("rset");
                rset.classList.add("hide");
                rnew.classList.remove("hide");
                rnew.classList.add("rset")
                mpadding.classList.remove("BigBox");
                mpadding.classList.add("BeegBox");
            }if (winner()==="Draw"){
                idnty.innerHTML = "";
                announce.classList.remove("hide1");
                announce.classList.add("announce");
                announce.innerHTML = "It is a DEAD DRAW :("
                rset.classList.remove("rset");
                rset.classList.add("hide");
                rnew.classList.remove("hide");
                rnew.classList.add("rset");
                mpadding.classList.remove("BigBox");
                mpadding.classList.add("BeegBox");
            }
            check();

            
        } else{
            button.innerText = movet;
            movet = "X";
            button.disabled = true;
            idnty.innerHTML = "<i>Next Move: X</i>";
            button.removeEventListener("mouseover", m_event);
            winner();
            if(winner()!=""){
                idnty.innerHTML = "";
                announce.classList.remove("hide1");
                announce.classList.add("announce");
                announce.innerHTML = `Congratulations! Winner is ${winner()} <h3><i> scroll down </i> </h3>`;
                rset.classList.remove("rset");
                rset.classList.add("hide");
                rnew.classList.remove("hide");
                rnew.classList.add("rset");
                mpadding.classList.remove("BigBox");
                mpadding.classList.add("BeegBox");

            }if(winner()==="Draw"){
                idnty.innerHTML = "";
                announce.classList.remove("hide1");
                announce.classList.add("announce");
                announce.innerHTML = "It is a DEAD DRAW :(";
                rset.classList.remove("rset");
                rset.classList.add("hide");
                rnew.classList.remove("hide");
                rnew.classList.add("rset");
                mpadding.classList.remove("BigBox");
                mpadding.classList.add("BeegBox");
            }
            check();
        }
    });
    rset.addEventListener("click",()=>{
        button.innerText = "";
        button.disabled = false;
        movet="X";
        idnty.innerHTML = "<i>Default: X plays first</i>";
        announce.classList.remove("announce");
        announce.classList.add("hide1");
        button.addEventListener("mouseover", m_event);
        mpadding.classList.remove("BeegBox");
        mpadding.classList.add("BigBox");
        button.classList.remove("winbox");
    });
    rnew.addEventListener("click",()=>{
        button.innerText = "";
        button.disabled = false;
        movet="X";
        idnty.innerHTML = "<i>Default: X plays first</i>";
        announce.classList.remove("announce");
        announce.classList.add("hide1");
        button.addEventListener("mouseover", m_event);
        rnew.classList.remove("rset");
        rnew.classList.add("hide");
        rset.classList.remove("hide");
        rset.classList.add("rset");
        mpadding.classList.remove("BeegBox");
        mpadding.classList.add("BigBox");
        button.classList.remove("winbox");

    });
    let check = () => {
        if (winner() !== "" && winner()!=="Draw"){
            for (let box of butns){
                box.disabled = true;
            }   
        }else{
            for (let box of butns){
                box.disabled = false;
            }
        }
    };
});

const winner = () => {
    for (let win of winningP) {
        if (butns[win[0]].innerText !== "" && butns[win[0]].innerText === butns[win[1]].innerText &&
            butns[win[1]].innerText === butns[win[2]].innerText){
            butns[win[0]].classList.add("winbox");
            butns[win[1]].classList.add("winbox");
            butns[win[2]].classList.add("winbox");
            return butns[win[0]].innerText;
        }
    }
    isDraw = true;
    for (let box of butns){
        if (box.innerText === ""){
            isDraw = false;
            break;
        }
    }

    if (isDraw) return "Draw";

    return "";
};

        
