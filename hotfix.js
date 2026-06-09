"use strict";

(function applyCookingHotfix() {
  const style = document.createElement("style");
  style.textContent = `
    .cook-button {
      width: 100%;
      min-height: 28px;
      margin-top: 6px;
      border: 0;
      border-radius: 8px;
      background: var(--ink);
      color: #fff;
      cursor: pointer;
      font-weight: 950;
      font-size: 0.74rem;
    }
    @media (max-width: 560px) {
      .cook-button {
        min-height: 24px;
        margin-top: 4px;
        font-size: 0.66rem;
      }
    }
  `;
  document.head.appendChild(style);

  function cleanText(text) {
    return text
      .replace("레시피를 보고 ", "")
      .replace("레시피와", "주문과")
      .replace("레시피가", "조합이");
  }

  const oldSetMessage = setMessage;
  setMessage = function setCleanMessage(text) {
    oldSetMessage(cleanText(text));
  };

  const oldRender = render;
  render = function renderCleanGame() {
    oldRender();
    scrubScreen();
  };

  function scrubScreen() {
    if (!globalThis.document?.body) return;

    const title = document.getElementById("orderTitle");
    if (title) title.textContent = title.textContent.replace("제철 레시피", "제철 주문");

    document.querySelectorAll(".recipe-line").forEach((node) => node.remove());

    document.querySelectorAll(".station-empty .small").forEach((node) => {
      if (node.textContent.includes("레시피:")) node.textContent = "재료를 자유롭게 조합";
    });

    document.querySelectorAll(".action-pad").forEach((pad) => {
      if (pad.querySelector(".cook-button")) return;
      const button = document.createElement("button");
      button.className = "cook-button";
      button.type = "button";
      button.textContent = "조리하기";
      button.addEventListener("pointerdown", (event) => event.stopPropagation());
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        completeAction(pad.dataset.slot);
      });
      pad.appendChild(button);
    });
  }

  const startTitle = document.querySelector("#startOverlay h2");
  const startCopy = document.querySelector("#startOverlay p");
  if (startTitle) startTitle.textContent = "재료를 직접 조합하기";
  if (startCopy) startCopy.textContent = "원재료와 양념을 조리대에 넣고 조리하세요. 주문과 어울릴수록 완성도와 매출이 올라갑니다.";

  new MutationObserver(scrubScreen).observe(document.body, { childList: true, subtree: true });
  scrubScreen();
})();
