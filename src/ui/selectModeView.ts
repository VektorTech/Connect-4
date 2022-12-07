export default class SelectModeView {
  private root: HTMLElement;

  constructor() {
    const _root = document.getElementById("game");
    if (_root instanceof HTMLElement) {
      this.root = _root;
    } else {
      throw new TypeError("Invalid Element Type");
    }
  }

  showSelectScreen() {
    const template: HTMLTemplateElement = document.getElementById(
      "select-mode-template"
    ) as HTMLTemplateElement;
    const clonedView = template.content.cloneNode(true);
    if (template) {
      this.root.replaceChildren(clonedView);
      this.root.querySelector("#select-v-ai").addEventListener("click", (e) => {
        e.stopPropagation();
        dispatchEvent(new CustomEvent("game/start", { detail: { bot: true, name: "AI" } }));
      });
      // this.root.querySelector("#select-v-human").addEventListener("click", (e) => {
      //   e.stopPropagation();
      // });
      this.root.querySelector("#find-player").addEventListener("click", (e) => {
        e.stopPropagation();
        const name: HTMLInputElement = this.root.querySelector("#username");
        dispatchEvent(new CustomEvent("game/pending", { detail: { bot: false, name: name.value } }));
      });
    }
  }
}
