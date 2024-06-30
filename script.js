// Function to handle removal from storage
removeFromStorage = (storage, event) => {
  if (event.target.classList.contains("delete")) {
    if (confirm("Are you sure?") === false) {
      return;
    }

    const key = event.target.dataset.local;
    storage.removeItem(key);
    getLocalStorageItems();
  }
};

// Function to update select all checkbox state
function updateSelectAllCheckbox(listClass, masterCheckboxId) {
  const checkboxes = document.querySelectorAll(`.${listClass}`);
  const masterCheckbox = document.getElementById(masterCheckboxId);
  const totalCheckboxes = checkboxes.length;
  let checkedCheckboxes = 0;

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedCheckboxes++;
    }
  });

  masterCheckbox.checked =
    totalCheckboxes > 0 && totalCheckboxes === checkedCheckboxes;
}

// Function to handle checkbox clicks and update UI
function handleFromStorage(event) {
  removeFromStorage(
    event.target.classList.contains("localList")
      ? localStorage
      : sessionStorage,
    event
  );

  updateSelectAllCheckbox("localListCheck", "localCheck");
  updateSelectAllCheckbox("sessionListCheck", "sessionCheck");
}

// Function to set items in storage to the UI
setStorage = (storage, list) => {
  for (let i = 0; i < storage.length; i++) {
    const li = document.createElement("li");
    li.classList.add("list-group-item");

    const spanKey = document.createElement("b");
    spanKey.textContent = `${storage.key(i)}`;

    const spanValue = document.createElement("span");
    spanValue.innerHTML = storage.getItem(storage.key(i));

    const deleteButton = document.createElement("button");
    deleteButton.classList.add(
      "btn",
      "btn-danger",
      "btn-sm",
      "float-end",
      "delete",
      `${list.id}`
    );
    deleteButton.innerHTML = "Delete";
    deleteButton.dataset.local = storage.key(i);

    const div = document.createElement("div");
    div.classList.add("form-check");

    const checkInput = document.createElement("input");
    checkInput.classList.add("form-check-input", `${list.id}Check`);
    checkInput.type = "checkbox";
    checkInput.value = storage.key(i);
    checkInput.id = `${list.id}Check`;

    div.appendChild(checkInput);
    div.appendChild(spanKey);
    div.appendChild(document.createTextNode(" : "));
    div.appendChild(spanValue);
    div.appendChild(document.createTextNode(" "));
    div.appendChild(deleteButton);

    li.appendChild(div);
    list.appendChild(li);
  }
};

// Function to fetch and display local and session storage items
getLocalStorageItems = () => {
  const list = document.getElementById("localList");
  const sessionList = document.getElementById("sessionList");

  document.querySelectorAll("ul").forEach((ul) => {
    ul.innerHTML = "";
    ul.classList.add("list-group", "list-group-flush");
  });

  setStorage(localStorage, list);
  setStorage(sessionStorage, sessionList);

  updateSelectAllCheckbox("localListCheck", "localCheck");
  updateSelectAllCheckbox("sessionListCheck", "sessionCheck");
};

// Function to toggle checkboxes based on master checkbox state
function toggleCheckboxes(masterCheckboxId, checkboxClass) {
  const masterCheckbox = document.getElementById(masterCheckboxId);
  masterCheckbox.addEventListener("change", function () {
    const checkboxes = document.querySelectorAll(`.${checkboxClass}`);
    const deleteAllButton = document.getElementById(
      `btn-delete-all-${masterCheckboxId}`
    );

    if (checkboxes.length === 0) {
      masterCheckbox.disabled = true;
      deleteAllButton.style.display = "none";
      return;
    } else {
      masterCheckbox.disabled = false;
    }

    checkboxes.forEach((input) => {
      input.checked = masterCheckbox.checked;
      const deleteButton = input.parentNode.querySelector(".delete");
      deleteButton.style.display = masterCheckbox.checked
        ? "none"
        : "inline-block";
      deleteButton.disabled = masterCheckbox.checked;
    });

    deleteAllButton.style.display = masterCheckbox.checked ? "block" : "none";

    const otherCheckboxes = document.querySelectorAll(
      `.${checkboxClass}:not(#${masterCheckboxId})`
    );
    otherCheckboxes.forEach((input) => {
      const deleteButton = input.parentNode.querySelector(".delete");
      deleteButton.style.display = masterCheckbox.checked
        ? "none"
        : "inline-block";
      deleteButton.disabled = masterCheckbox.checked;
    });
  });
}

// Event listeners for document load and checkbox toggling
document.addEventListener("DOMContentLoaded", function () {
  getLocalStorageItems();

  toggleCheckboxes("localCheck", "localListCheck");
  toggleCheckboxes("sessionCheck", "sessionListCheck");

  document.querySelectorAll(".localListCheck").forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      updateSelectAllCheckbox("localListCheck", "localCheck");
    });
  });

  document.querySelectorAll(".sessionListCheck").forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      updateSelectAllCheckbox("sessionListCheck", "sessionCheck");
    });
  });

  const localCheck = document.getElementById("localCheck");
  const sessionCheck = document.getElementById("sessionCheck");

  localCheck.addEventListener("change", function () {
    const deleteAllButton = document.getElementById("btn-delete-all-localList");
    deleteAllButton.style.display = localCheck.checked ? "block" : "none";

    document.querySelectorAll(".localList .delete").forEach((deleteButton) => {
      deleteButton.style.display = localCheck.checked ? "none" : "inline-block";
    });
  });

  sessionCheck.addEventListener("change", function () {
    const deleteAllButton = document.getElementById(
      "btn-delete-all-sessionList"
    );
    deleteAllButton.style.display = sessionCheck.checked ? "block" : "none";

    document
      .querySelectorAll(".sessionList .delete")
      .forEach((deleteButton) => {
        deleteButton.style.display = sessionCheck.checked
          ? "none"
          : "inline-block";
      });
  });

  const deleteAllLocalButton = document.getElementById(
    "btn-delete-all-localList"
  );
  deleteAllLocalButton.addEventListener("click", function () {
    localStorage.clear();
    getLocalStorageItems();
    deleteAllLocalButton.style.display = "none";
  });

  const deleteAllSessionButton = document.getElementById(
    "btn-delete-all-sessionList"
  );
  deleteAllSessionButton.addEventListener("click", function () {
    sessionStorage.clear();
    getLocalStorageItems();
    deleteAllSessionButton.style.display = "none";
  });

  const localList = document.getElementById("localList");
  const sessionList = document.getElementById("sessionList");

  localList.addEventListener("click", handleFromStorage);
  sessionList.addEventListener("click", handleFromStorage);

  const saveButton = document.getElementById("btn-save");
  saveButton.addEventListener("click", function () {
    const keyInput = document.getElementById("key");
    const valueInput = document.getElementById("value");
    const key = keyInput.value;
    const value = valueInput.value;

    localStorage.setItem(key, value);
    sessionStorage.setItem(key, value);

    getLocalStorageItems();
    keyInput.value = "";
    valueInput.value = "";
  });
});
