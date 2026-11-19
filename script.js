"use strict";

// ACTA's on-page correspondence journey is an illustrative interaction.
// It does not send notices, confirm real deliveries, or write to a blockchain.
const stages = [
  { title: "Send", description: "The process starts with a clear record of what was sent.", left: "01 / NOTICE SENT", right: "RECORD CREATED ✓" },
  { title: "Deliver", description: "Delivery information follows the notice, step by step.", left: "02 / IN TRANSIT", right: "TRAIL UPDATED ✓" },
  { title: "Prove", description: "Tracking, timestamps and supporting evidence stay connected.", left: "03 / DELIVERY", right: "EVIDENCE KEPT ✓" },
  { title: "Reply", description: "Responses link back to the notice that started the process.", left: "04 / RESPONSE", right: "REPLY LINKED ✓" }
];
let currentStage = 0;
const nextButton = document.getElementById("next-stage");
const title = document.getElementById("stage-title");
const description = document.getElementById("stage-description");
const index = document.getElementById("stage-index");
const progress = document.getElementById("progress-fill");
const leftTag = document.querySelector(".tag-left");
const rightTag = document.querySelector(".tag-right");
const track = document.querySelector(".progress-track");

function renderStage() {
  const item = stages[currentStage];
  index.textContent = String(currentStage + 1).padStart(2, "0") + " / 04";
  title.textContent = item.title;
  description.textContent = item.description;
  leftTag.textContent = item.left;
  rightTag.textContent = item.right;
  progress.style.width = String((currentStage + 1) * 25) + "%";
  track.setAttribute("aria-label", "Stage " + (currentStage + 1) + " of 4: " + item.title);
  nextButton.setAttribute("aria-label", "Show " + stages[(currentStage + 1) % stages.length].title + " stage");
  nextButton.innerHTML = currentStage === stages.length - 1 ? "RESTART <span aria-hidden=\"true\">↺</span>" : "NEXT <span aria-hidden=\"true\">→</span>";
}

nextButton.addEventListener("click", () => {
  currentStage = (currentStage + 1) % stages.length;
  renderStage();
});
renderStage();
