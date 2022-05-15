"use strict";
const resContainer = document.querySelector(".responses");

const btn = document.querySelector(".btn-submit");
const btnLoad = document.querySelector(".btn-load");
const btnHide = document.querySelector(".btn-hide");
const btnScroll = document.querySelector(".btn-scroll");

const prompt = document.querySelector(".prompt");
const resHeader = document.querySelector(".responses-header");
const storedResult = localStorage.getItem("results");
const oldResContainer = document.createElement("div");
const oldResHeader = document.createElement("h2");

const allResults = [];

let userInput = "";

//Functions

const addResponse = function (data) {
  resHeader.classList.remove("responses-header");

  const html = `
    <table class="responses-table" cellspacing="20">
      <tr>
        <td class="cell-header">Prompt:</th>
        <td>${userInput}</td>
      </tr>
      <tr>
        <td class="cell-header">Response:</td>
        <td>
        ${data.choices[0].text}
        </td>
      </tr>
    </table>`;

  resContainer.insertAdjacentHTML("afterbegin", html);
  saveToLocalStorage();
  prompt.value = "";
};

const saveToLocalStorage = function () {
  localStorage.setItem("results", resContainer.outerHTML);
};

//Event Handlers

btn.addEventListener("click", function (e) {
  e.preventDefault();
  btn.classList.toggle("btn-loading");

  userInput = prompt.value;

  const data = {
    prompt: userInput,
    temperature: 0.5,
    max_tokens: 64,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
  };

  const key = "";

  fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      addResponse(data);
    })
    .catch((err) => {
      console.error(err);
      resHeader.classList.remove("responses-header");

      resHeader.innerHTML = `${err.message} 😞`;
    })
    .finally(() => {
      btn.classList.toggle("btn-loading");
    });
});

btnLoad.addEventListener("click", function () {
  console.log(storedResult);
  if (storedResult) {
    btnLoad.classList.remove("btn--active");
    btnHide.classList.add("btn--active");
    resContainer.insertAdjacentElement("afterend", oldResContainer);
    oldResContainer.insertAdjacentElement("afterbegin", oldResHeader);
    oldResHeader.innerHTML = "Previous Responses";
    oldResContainer.insertAdjacentHTML("beforeend", storedResult);
  } else {
    alert("There is no previous data");
  }
});

btnHide.addEventListener("click", function () {
  btnLoad.classList.add("btn--active");
  btnHide.classList.remove("btn--active");
  resHeader.classList.add("responses-header");
  oldResContainer.innerHTML = "";
});

btnScroll.addEventListener("click", function () {
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth",
  });
});
