import TashIcon from "../components/trashIcon.js";

import { getFileExtention, humanFileSize } from "../utils/file.js";
import { genRandomId } from "../utils/id.js";

const emptyListInfoEl = document.getElementById("file-list__empty-list-item");
const fileListEl = document.getElementById("file-list");
const inputFileEl = document.querySelector("input[type=file]");
const labelFileUploadEl = document.getElementById("file-upload");
const dropZoneTextEl = document.getElementById("drop-zone__text");

const dropZoneTextElTexts = {
  over: "solta que eu pego",
  default: "solte ou selecione um arquivo",
};

inputFileEl.addEventListener("change", handleFiles);
labelFileUploadEl.addEventListener("dragover", handleDragOver);
labelFileUploadEl.addEventListener("drop", handleDrop);
["dragend", "dragleave"].forEach((eventType) =>
  labelFileUploadEl.addEventListener(eventType, handleDragEndAndDragLeave)
);

function updateFileList(files) {
  if (!files) {
    emptyListInfoEl.removeAttribute("hidden");
  } else {
    emptyListInfoEl.setAttribute("hidden", "");
  }

  for (const file of files) {
    const fileExtention = getFileExtention(file.name);
    const fileListItemEl = document.createElement("li");

    fileListItemEl.setAttribute("id", file.id);

    fileListItemEl.innerHTML = `
      <div class="card-file__list-item">
        <figure style="background-image: url('${file.img}');">
          ${!file.img ? `<span>${fileExtention}</span>` : ""}
        </figure>
        <div class="card-file__list-item-file-details">
          <span class="card-file__list-item-filename" class="c-white font-weight-500">${
            file.name
          }</span>
          <span class="card-file__list-item-size">${humanFileSize(
            file.size
          )}</span>
        </div>
        <div>
          <button onclick="removeFileFromList('${
            file.id
          }')" class="icon-button">
            ${TashIcon}
          </button>
        </div>
      </div>
    `;

    fileListEl.appendChild(fileListItemEl);
  }
}

function getFileImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
  });
}

async function handleFiles(e, dropEvent) {
  let files = null;

  if (dropEvent) {
    files = dropEvent.dataTransfer.files;
  } else {
    files = e.target.files;
  }
  for (const file of files) {
    file.id = genRandomId();
    const fileIsAnImage = file.type.startsWith("image/");

    if (fileIsAnImage) {
      const image = await getFileImage(file);
      file.img = image;
    }
  }
  updateFileList(files);
}

function handleDragOver(e) {
  e.preventDefault();
  labelFileUploadEl.classList.add("file-upload__over");
  dropZoneTextEl.innerText = dropZoneTextElTexts["over"];
}

function handleDragEndAndDragLeave(e) {
  e.preventDefault();
  labelFileUploadEl.classList.remove("file-upload__over");
  dropZoneTextEl.innerText = dropZoneTextElTexts["default"];
}

function handleDrop(e) {
  e.preventDefault();
  labelFileUploadEl.classList.remove("file-upload__over");
  dropZoneTextEl.innerText = dropZoneTextElTexts["default"];

  handleFiles(null, e);
}

window.removeFileFromList = (id) => {
  document.getElementById(id).remove();
};
