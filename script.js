"use strict";
const resContainer = document.querySelector(".responses");

const btn = document.querySelector(".btn-submit");
const btnScroll = document.querySelector(".btn-scroll");

const prompt = document.querySelector(".prompt");
const resHeading = document.querySelector(".res-heading");
const storedResult = JSON.parse(localStorage.getItem("allResults"));
const data = {
  temperature: 0.5,
  max_tokens: 64,
  top_p: 1.0,
  frequency_penalty: 0.0,
  presence_penalty: 0.0,
};

let userInput = "";

//Functions

const getDate = function () {
  const curDate = new Date();
  const locale = navigator.language;
  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const dateTime = new Intl.DateTimeFormat(locale, options).format(curDate);

  return dateTime;
};

const addResponse = function (data) {
  resHeading.classList.remove("hide");
  const html = `
  <table class="responses-table" cellspacing="20">
  <tr>
    <td colspan="2" class="cell-header timestamp" >${getDate()}</td>
  </tr>
  <tr>
    <td class="cell-header">Prompt:</th>
    <td class="user-input">${userInput}</td>
  </tr>
  <tr>
    <td class="cell-header">Response:</td>
    <td class="response">
    ${data.choices[0].text}
    </td>
  </tr>
</table>`;

  resContainer.insertAdjacentHTML("afterbegin", html);
  saveToLocalStorage();
  prompt.value = "";
};

const saveToLocalStorage = function () {
  const userInput = document.querySelector(".user-input").innerText;
  const response = document.querySelector(".response").innerText;
  const timestamp = document.querySelector(".timestamp").innerText;
  const results = {
    userInput: userInput,
    response: response,
    timestamp: timestamp,
  };
  const currentItems = JSON.parse(localStorage.getItem("allResults")) || [];

  currentItems.push(results);

  localStorage.setItem("allResults", JSON.stringify(currentItems));
};

const getCompletions = function () {
  const key = "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";

  return fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

const showPreviousResponses = function () {
  if (storedResult) {
    for (let eachResult of storedResult) {
      const html = `
      <table class="responses-table" cellspacing="20">
        <tr>
          <td colspan="2" class="cell-header timestamp" >${eachResult.timestamp}</td>
        </tr>
        <tr>
          <td class="cell-header">Prompt:</th>
          <td class="user-input">${eachResult.userInput}</td>
        </tr>
        <tr>
          <td class="cell-header">Response:</td>
          <td class="response">
          ${eachResult.response}
          </td>
        </tr>
      </table>`;
      resContainer.insertAdjacentHTML("afterbegin", html);
    }
  }
};

showPreviousResponses();

//Event Handlers

btn.addEventListener("click", function (e) {
  e.preventDefault();
  btn.classList.toggle("btn-loading");
  btn.disabled = true;

  userInput = prompt.value;
  data.prompt = userInput;

  getCompletions()
    .then((data) => {
      addResponse(data);
    })
    .catch((err) => {
      console.error(err);
      resHeading.classList.remove("hide");
      resHeading.innerHTML = `${err.message} 😞`;
    })
    .finally(() => {
      btn.classList.toggle("btn-loading");
      btn.disabled = false;
    });
});

btnScroll.addEventListener("click", function () {
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth",
  });
});
