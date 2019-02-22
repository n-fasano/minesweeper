function createGrid(width, height, bombNumber) {
  //
  let gridArray = [];
  //
  for (let i = 0; i < height; i++) {
    gridArray[i] = [];
    for (let j = 0; j < width; j++) {
      gridArray[i].push(0);
    }
  }

  let k = 0;
  while (k < bombNumber) {
    let randRow = Math.floor(Math.random() * height);
    let randCell = Math.floor(Math.random() * width);
    if (gridArray[randRow][randCell] !== -1) {
      gridArray[randRow][randCell] = -1;
      k++;
    }
  }

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (gridArray[i][j] != -1) {
        let count = 0;
        if (gridArray[i][j - 1] == -1) count++;
        if (gridArray[i][j + 1] == -1) count++;
        if (i > 0 && gridArray[i - 1][j - 1] == -1) count++;
        if (i > 0 && gridArray[i - 1][j] == -1) count++;
        if (i > 0 && gridArray[i - 1][j + 1] == -1) count++;
        if (i < height - 1 && gridArray[i + 1][j - 1] == -1) count++;
        if (i < height - 1 && gridArray[i + 1][j] == -1) count++;
        if (i < height - 1 && gridArray[i + 1][j + 1] == -1) count++;
        gridArray[i][j] = count;
      }
    }
  }

  return gridArray;
}

function displayGrid(gridArray) {
  //
  const grid = document.querySelector("table#grid");
  grid.innerHTML = "";
  //
  for (let i = 0; i < gridArray.length; i++) {
    let newRow = createElem("TR", "id", "row" + (i + 1));
    grid.appendChild(newRow);

    for (let j = 0; j < gridArray[i].length; j++) {
      let newCell = createElem(
        "TD",
        "id",
        "cell" + (i * gridArray[i].length + j + 1)
      );
      newCell.appendChild(createElem("DIV", "class", "aboveCell"));

      if (gridArray[i][j] == -1) {
        newCell.appendChild(createElem("I", "class", "fas fa-bomb"));
      } else {
        newCell.appendChild(document.createTextNode(gridArray[i][j]));
      }

      if (gridArray[i][j] == 0) {
        newCell.setAttribute("data-zero", 0);
        newCell.style.color = "white";
      }

      newRow.appendChild(newCell);
    }
  }
}

function reveal(cellsToReveal, forbiddenIDs, width, height) {
  let bombIcon = document.createElement("I");
  bombIcon.setAttribute("class", "fas fa-bomb");

  let id = Number(cellsToReveal[0].getAttribute("id").slice(4));
  cellsToReveal.splice(0, 1);
  let aboveCellsToReveal = [];
  let cellsAround = [];

  if (forbiddenIDs.indexOf(id) == -1) {
    forbiddenIDs.push(id);
    // CASES AU-DESSUS
    if (id > width) {
      if ((id - 1) % height !== 0) {
        cellsAround.push(document.getElementById("cell" + (id - width - 1)));
      }
      cellsAround.push(document.getElementById("cell" + (id - width)));
      if (id % height !== 0) {
        cellsAround.push(document.getElementById("cell" + (id - width + 1)));
      }
    }

    // CASES EN-DESSOUS
    if (id < width * height - width) {
      if ((id - 1) % height !== 0) {
        cellsAround.push(
          document.getElementById("cell" + (id - 1 + Number(width)))
        );
      }
      cellsAround.push(document.getElementById("cell" + (Number(width) + id)));
      if (id % height !== 0) {
        cellsAround.push(
          document.getElementById("cell" + (Number(width) + id + 1))
        );
      }
    }

    // CASE DEVANT
    if (id < width * height - 1 && id % height !== 0) {
      cellsAround.push(document.getElementById("cell" + (id + 1)));
    }

    // CASE DERRIERE
    if (id > 1 && (id - 1) % height !== 0) {
      cellsAround.push(document.getElementById("cell" + (id - 1)));
    }

    cellsAround.forEach(function(cell) {
      if (!cell.childNodes[0].hasChildNodes()) {
        aboveCellsToReveal.push(cell);
      }
      if (cell.hasAttribute("data-zero") && cellsToReveal.indexOf(cell) == -1) {
        cellsToReveal.push(cell);
      }
    });

    aboveCellsToReveal.forEach(function(cell) {
      cell.classList.add("hideCache");
      if (hasClass(cell.childNodes[1], "fas fa-bomb")) revealAll(cell);
    });
  }

  if (cellsToReveal.length > 0) {
    reveal(cellsToReveal, forbiddenIDs, width, height);
  }
}

function revealAll(doomCell) {
  doomCell.childNodes[1].style.transform = "scale(350)";
  document.querySelectorAll("td").forEach(function(cell) {
    cell.childNodes[0].style.display = "none";
    cell.style.color = "firebrick";
  });
  form.style.display = "block";
  setTimeout(function() {
    displayGrid(
      createGrid(
        document.querySelector('input[name="gridSize"]:checked').dataset.width,
        document.querySelector('input[name="gridSize"]:checked').dataset.height,
        document.querySelector('input[name="gridSize"]:checked').dataset
          .bombnumber
      )
    );
  }, 5000);
}

document.querySelectorAll("td").forEach(function(td) {
  td.addEventListener("click", clickHandler);
  td.addEventListener("contextmenu", rightClickHandler);
});

function clickHandler() {
  if (!hasClass(this, "hideCache")) {
    this.classList.add("hideCache");
    if (this.contains(bombIcon)) {
      revealAll(this);
    }
    if (this.hasAttribute("data-zero")) {
      reveal([this], [], width, height);
    }
  }
  if (
    document.querySelectorAll("td.hideCache").length ==
    width * height - bombNumber
  ) {
    alert("YOU WIN !!");
    clearInterval(checkWin);
  }
}

function rightClickHandler(e) {
  e.preventDefault();
  if (!hasClass(this, "hideCache")) {
    if (this.childNodes[0].innerHTML == "") {
      this.childNodes[0].innerHTML = '<i class="far fa-flag"></i>';
      this.removeEventListener("click", clickHandler);
      flagCount--;
      flags.innerHTML = flagCount + '<i class="far fa-flag"></i>';
    } else if (this.childNodes[0].innerHTML == '<i class="far fa-flag"></i>') {
      this.childNodes[0].innerHTML = '<i class="fas fa-question"></i>';
      this.addEventListener("click", clickHandler);
      flagCount++;
      flags.innerHTML = flagCount + '<i class="far fa-flag"></i>';
    } else {
      this.childNodes[0].innerHTML = "";
    }
  } else {
    this.addEventListener("mousedown", rightPlusLeftClickHandler);
    this.addEventListener("mouseup", removeHandlers);
  }
}

function rightPlusLeftClickHandler() {
  reveal([this], [], width, height);
  if (
    document.querySelectorAll("td.hideCache").length ==
    width * height - bombNumber
  ) {
    alert("YOU WIN !!");
    clearInterval(checkWin);
  }
}

function removeHandlers() {
  this.removeEventListener("mousedown", rightPlusLeftClickHandler);
  this.removeEventListener("mouseup", removeHandlers);
}
